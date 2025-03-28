import { create } from 'zustand';

export const createAiStore = (transform = data => data) => create((set, get) => ({
    data: null,
    isLoading: false,
    error: null,
    setData: (data) => set({ data: transform(data), isLoading: false, error: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),
    reset: () => set({ data: null, isLoading: false, error: null }),
}));