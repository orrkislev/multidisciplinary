'use client';

import { useState } from 'react';
import useReceiptStore from '../utils/receiptStore';

export default function SeedForm({ onComplete }) {
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const { setProjectSeed, setIsGenerating } = useReceiptStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim() || !duration.trim()) return;

        const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        setProjectSeed(description, duration, date);
        setIsGenerating(true);

        try {
            const response = await fetch('/api/receipt/seed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectDescription: description, projectDuration: duration })
            });

            const data = await response.json();
            if (onComplete) onComplete(data);
        } catch (error) {
            console.error('Error generating seed fragments:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-3">Receipt</h1>
                    <p className="text-lg text-slate-600">
                        Transform your project into a learning receipt
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            What did you work on?
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="I painted a portrait of my grandmother from an old photograph. Oil on canvas. First time doing a realistic portrait."
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            How long did it take?
                        </label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="About 3 weeks"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Generate Receipt
                    </button>
                </form>
            </div>
        </div>
    );
}
