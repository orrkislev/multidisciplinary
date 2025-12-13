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
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-3">
                    <span className={value < 40 ? 'font-semibold text-slate-900' : ''}>{slider.left}</span>
                    <span className={value > 60 ? 'font-semibold text-slate-900' : ''}>{slider.right}</span>
                </div>

                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => !committed && setValue(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                        disabled={committed}
                    />
                </div>
            </div>

            {!committed && (
                <button
                    onClick={handleCommit}
                    className="w-full bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                >
                    Add to Receipt
                </button>
            )}

            {committed && (
                <div className="text-center text-sm text-green-600 font-medium">
                    ✓ Added to receipt
                </div>
            )}
        </div>
    );
}
