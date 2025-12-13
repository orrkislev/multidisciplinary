import { create } from 'zustand';

const useReceiptStore = create((set, get) => ({
    // Project seed
    projectDescription: '',
    projectDuration: '',
    projectDate: '',

    // Generated fragments (from AI)
    fragments: [],

    // User responses
    responses: [],

    // Receipt data
    receipt: {
        title: '',
        date: '',
        duration: '',
        skills: [],
        process: [],
        costs: [],
        total: '',
        coupon: '',
    },

    // UI state
    currentCluster: 'process',
    isGenerating: false,
    sessionStarted: false,

    // Actions
    setProjectSeed: (description, duration, date) => set({
        projectDescription: description,
        projectDuration: duration,
        projectDate: date,
        sessionStarted: true,
        receipt: {
            ...get().receipt,
            title: description,
            date: date,
            duration: duration,
        }
    }),

    addFragment: (fragment) => set((state) => ({
        fragments: [...state.fragments, fragment]
    })),

    addFragments: (fragments) => set((state) => ({
        fragments: [...state.fragments, ...fragments]
    })),

    markFragmentUsed: (fragmentId) => set((state) => ({
        fragments: state.fragments.map(f =>
            f.id === fragmentId ? { ...f, used: true } : f
        )
    })),

    markFragmentDismissed: (fragmentId) => set((state) => ({
        fragments: state.fragments.map(f =>
            f.id === fragmentId ? { ...f, dismissed: true } : f
        )
    })),

    recordResponse: (fragmentId, fragmentType, value) => set((state) => ({
        responses: [...state.responses, {
            fragmentId,
            fragmentType,
            value,
            timestamp: Date.now()
        }]
    })),

    addReceiptItem: (section, item) => set((state) => ({
        receipt: {
            ...state.receipt,
            [section]: [...state.receipt[section], item]
        }
    })),

    updateReceiptItem: (section, index, item) => set((state) => ({
        receipt: {
            ...state.receipt,
            [section]: state.receipt[section].map((existingItem, i) =>
                i === index ? item : existingItem
            )
        }
    })),

    removeReceiptItem: (section, index) => set((state) => ({
        receipt: {
            ...state.receipt,
            [section]: state.receipt[section].filter((_, i) => i !== index)
        }
    })),

    setTotal: (total) => set((state) => ({
        receipt: { ...state.receipt, total }
    })),

    setCoupon: (coupon) => set((state) => ({
        receipt: { ...state.receipt, coupon }
    })),

    setIsGenerating: (isGenerating) => set({ isGenerating }),

    setCurrentCluster: (cluster) => set({ currentCluster: cluster }),

    reset: () => set({
        projectDescription: '',
        projectDuration: '',
        projectDate: '',
        fragments: [],
        responses: [],
        receipt: {
            title: '',
            date: '',
            duration: '',
            skills: [],
            process: [],
            costs: [],
            total: '',
            coupon: '',
        },
        currentCluster: 'process',
        isGenerating: false,
        sessionStarted: false,
    })
}));

export default useReceiptStore;
