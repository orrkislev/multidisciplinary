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
        <div className="flex items-center justify-center min-h-screen bg-stone-deep p-8">
            <div className="w-full max-w-2xl paper p-8 md:p-12">
                <div className="mb-8">
                    <h1 className="display text-5xl mb-3">Receipt</h1>
                    <p className="text-lg text-ink-soft">
                        Transform your project into a learning receipt
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            What did you work on?
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="I painted a portrait of my grandmother from an old photograph. Oil on canvas. First time doing a realistic portrait."
                            className="field !rounded-[1.25rem] w-full resize-none"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">
                            How long did it take?
                        </label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="About 3 weeks"
                            className="field w-full"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="pebble-btn w-full !py-4"
                    >
                        Generate Receipt
                    </button>
                </form>
            </div>
        </div>
    );
}
