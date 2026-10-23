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
        <div className="paper p-6 animate-fade-in">
            <p className="mb-3 font-medium">
                {prompt}
            </p>

            <textarea
                value={text}
                onChange={(e) => !submitted && setText(e.target.value)}
                placeholder="Type your response..."
                className="field !rounded-[1.25rem] w-full resize-none mb-3"
                rows={2}
                maxLength={120}
                disabled={submitted}
            />

            {!submitted && (
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!text.trim()}
                        className="pebble-btn flex-1 text-sm"
                    >
                        Add to receipt
                    </button>
                    <button
                        onClick={handleSkip}
                        className="px-4 py-2 text-sm text-ink-soft hover:text-ink transition-colors cursor-pointer"
                    >
                        Skip
                    </button>
                </div>
            )}

            {submitted && text && (
                <div className="text-center text-sm text-pink font-medium">
                    ✓ Added to receipt
                </div>
            )}
        </div>
    );
}
