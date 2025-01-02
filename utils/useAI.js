import { experimental_useObject as useObject } from 'ai/react';
import { descriptionSchema, namesSchema, projectsSchema, questionsSchema, terminologySchema } from './Schema';
import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { object } from 'zod';


export const useSubjects = create((set) => ({
    subject1: null,
    subject2: null,
    setSubjects: (subject1, subject2) => set({ subject1, subject2 })
}));

export const useAiData = create((set) => ({
    name: null,
    names: null,
    description: null,
    projects: null,
    terminology: null,
    questions: null,
    setName: (name) => set({ name }),
    setNames: (names) => set({ names }),
    setDescription: (description) => set({ description }),
    setProjects: (projects) => set({ projects }),
    setTerminology: (terminology) => set({ terminology }),
    setQuestions: (questions) => set({ questions }),
    reset: () => set({ name: null, names: null, description: null, projects: null, terminology: null, questions: null })
}));

export default function useAIManager() {
    const { subject1, subject2 } = useSubjects();
    const ai = useAiData();
    const get_names = useObjectZustand({ api: '/api/name', schema: namesSchema, onUpdate: (object) => ai.setNames(object?.subjects) });
    const get_description = useObjectZustand({ api: '/api/name', schema: descriptionSchema, onUpdate: ai.setDescription });
    const get_projects = useObjectZustand({ api: '/api/name', schema: projectsSchema, onUpdate: (object) => ai.setProjects(object?.projects) });
    const get_terms = useObjectZustand({ api: '/api/name', schema: terminologySchema, onUpdate: ai.setTerminology });
    const get_questions = useObjectZustand({ api: '/api/name', schema: questionsSchema, onUpdate: (object) => ai.setQuestions(object?.questions) });

    useEffect(() => {
        if (subject1 && subject2) {
            get_names.submit({ action: 'name', subject1, subject2 });
        } else {
            ai.reset()
            get_names.reset();
            get_description.reset();
            get_projects.reset();
            get_terms.reset();
        }
    }, [subject1, subject2])

    useEffect(() => {
        if (!ai.names) return;
        ai.setName(ai.names[0]);
    }, [get_names.finished])

    useEffect(() => {
        if (!ai.name) return;
        get_description.submit({ action: 'description', subject1, subject2, name: ai.name });
        get_projects.submit({ action: 'projects', subject1, subject2, name: ai.name });
    }, [ai.name])

    useEffect(() => {
        if (!ai.description) return;
        get_terms.submit({ action: 'terms', subject1, subject2, name: ai.name, description: ai.description[0] });
        get_questions.submit({ action: 'questions', subject1, subject2, name: ai.name, description: ai.description[0] });
    }, [get_description.finished])

    useEffect(() => {
        if (!ai.projects) return
    }, [get_projects.finished])

    useEffect(() => {
        if (!ai.terminology) return
    }, [get_terms.finished])

    useEffect(() => {
        if (!ai.questions) return
    }, [get_questions.finished])
}





function useObjectZustand({ api, schema, onUpdate }) {
    const [finished, setFinished] = useState(false);
    const { object, submit } = useObject({
        api, schema, onFinish({ object, error }) {
            setFinished(true)
        }
    })
    useEffect(() => {
        if (object) onUpdate(object)
    }, [object])
    const reset = () => {
        onUpdate(null)
        setFinished(false)
    }
    return { object, submit, finished, reset }
}