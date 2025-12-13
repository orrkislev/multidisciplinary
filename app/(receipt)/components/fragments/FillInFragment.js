'use client';

import { useState } from 'react';
import useReceiptStore from '../../utils/receiptStore';

export default function FillInFragment({ prompt, fragmentId }) {
    const [text, setText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { recordResponse, addReceiptItem, markFragmentUsed } = useReceiptStore();

    const handleSubmit = () => {
        if (!text.trim() || submitted) return;

        setSubmitted(true);
        markFragmentUsed(fragmentId);
        recordResponse(fragmentId, 'fillin', { prompt, response: text });

        addReceiptItem('process', {
            label: `${prompt}: ${text}`,
            quantity: '',
            editable: true
        });
    };

    const handleSkip = () => {
        setSubmitted(true);
        markFragmentUsed(fragmentId);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-slate-700 mb-3 font-medium">
                {prompt}
            </p>

            <textarea
                value={text}
                onChange={(e) => !submitted && setText(e.target.value)}
                placeholder="Type your response..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none mb-3"
                rows={2}
                maxLength={120}
                disabled={submitted}
            />

            {!submitted && (
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                        className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Add to receipt
                    </button>
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-all"
                    >
                        Skip
                    </button>
                </div>
            )}

            {submitted && text && (
                <div className="text-center text-sm text-green-600 font-medium">
                    ✓ Added to receipt
                </div>
            )}
        </div>
    );
}
