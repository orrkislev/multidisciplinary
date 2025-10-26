import { create } from 'zustand';
import { getAIObject } from './ai actions';
import { aiSteps } from './ai-config';

export const useData = create((set, get) => ({
    activeMerge: 0,
    merges: [],
    getActiveMerge: () => get().merges.find(merge => merge.id === get().activeMerge) || get().merges[0],

    setActiveMerge: (id) => set({ activeMerge: id }),
    updateMerge: (updates, id) => set(state => {
        if (!id) id = state.activeMerge;
        return { merges: state.merges.map(merge => merge.id === id ? { ...merge, ...updates } : merge) };
    }),
    newMerge: () => {
        const newId = crypto.randomUUID();
        set(state => ({ merges: [...state.merges, { id: newId, name: 'Interdisciplinary' }], activeMerge: newId }));
    },
    removeMerge: (id) => {
        const merges = get().merges;
        const currActiveIndex = merges.findIndex(merge => merge.id === get().activeMerge);
        const deletedIndex = merges.findIndex(merge => merge.id === id);
        if (deletedIndex === currActiveIndex) {
            const nextIndex = currActiveIndex === merges.length - 1 ? currActiveIndex - 1 : currActiveIndex + 1;
            const nextId = merges[nextIndex].id;
            set({ activeMerge: nextId });
        }
        set({ merges: merges.filter(merge => merge.id !== id) });
    },

    toggleSubject: (subject, id) => {
        set(state => {
            if (!id) id = state.activeMerge;
            const currentMerge = state.merges.find(merge => merge.id === id);
            if (!currentMerge) return;
            if (!currentMerge.subjects) return { merges: state.merges.map(merge => merge.id === id ? { ...merge, subjects: [subject] } : merge) };
            if (currentMerge.subjects.includes(subject)) {
                return { merges: state.merges.map(merge => merge.id === id ? { ...merge, subjects: merge.subjects.filter(s => s !== subject) } : merge) };
            }
            return { merges: state.merges.map(merge => merge.id === id ? { ...merge, subjects: [...merge.subjects, subject] } : merge) };
        })
        get().startAI(id);
    },

    startAI: async (id) => {
        const currentMerge = get().getActiveMerge();
        if (!currentMerge || !currentMerge.subjects || currentMerge.subjects.length < 2) return;
        for (const step of aiSteps) {
            await Promise.all(step.map(key => get().getAIObject(id, key)));
        }
    },

    getAIObject: async (id, key) => {
        const currentMerge = get().getActiveMerge();
        if (!currentMerge) return;
        const res = await getAIObject(id, key, currentMerge);
        get().updateMerge({ [key]: res }, id);
    }
}))




export const dataActions = Object.fromEntries(
    Object.entries(useData.getState()).filter(([key, value]) => typeof value === 'function').map(([key, value]) => [key, value])
)

dataActions.newMerge();
