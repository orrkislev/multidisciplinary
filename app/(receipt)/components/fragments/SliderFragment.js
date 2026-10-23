'use client';

import { useState } from 'react';
import useReceiptStore from '../../utils/receiptStore';

export default function SliderFragment({ slider, fragmentId }) {
    const [value, setValue] = useState(50);
    const [committed, setCommitted] = useState(false);
    const { recordResponse, addReceiptItem, markFragmentUsed } = useReceiptStore();

    const handleCommit = () => {
        if (committed) return;

        setCommitted(true);
        markFragmentUsed(fragmentId);
        recordResponse(fragmentId, 'slider', { sliderId: slider.id, value });

        // Add to receipt based on slider position
        const label = value > 60 ? slider.right : value < 40 ? slider.left : `${slider.left} / ${slider.right}`;
        addReceiptItem('process', {
            label,
            quantity: '✓',
            editable: true
        });
    };

    return (
        <div className="paper p-6 animate-fade-in">
            <div className="mb-4">
                <div className="flex justify-between text-sm text-ink-soft mb-3">
                    <span className={value < 40 ? 'font-semibold text-ink' : ''}>{slider.left}</span>
                    <span className={value > 60 ? 'font-semibold text-ink' : ''}>{slider.right}</span>
                </div>

                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => !committed && setValue(Number(e.target.value))}
                        className="w-full accent-[#24201E] cursor-pointer"
                        disabled={committed}
                    />
                </div>
            </div>

            {!committed && (
                <button
                    onClick={handleCommit}
                    className="pebble-btn w-full text-sm"
                >
                    Add to Receipt
                </button>
            )}

            {committed && (
                <div className="text-center text-sm text-pink font-medium">
                    ✓ Added to receipt
                </div>
            )}
        </div>
    );
}
