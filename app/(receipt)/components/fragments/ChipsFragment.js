'use client';

import { useState } from 'react';
import useReceiptStore from '../../utils/receiptStore';

export default function ChipsFragment({ chips, fragmentId }) {
    const [selectedChips, setSelectedChips] = useState(new Set());
    const { recordResponse, addReceiptItem, markFragmentUsed } = useReceiptStore();

    const toggleChip = (chip) => {
        const newSelected = new Set(selectedChips);

        if (newSelected.has(chip)) {
            newSelected.delete(chip);
            // Remove from receipt (would need to track which items came from which chips)
        } else {
            newSelected.add(chip);
            // Add to receipt
            addReceiptItem('skills', {
                label: chip,
                quantity: '1x',
                editable: true
            });
            recordResponse(fragmentId, 'chips', chip);
        }

        setSelectedChips(newSelected);
        markFragmentUsed(fragmentId);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
                Skills & Concepts
            </h3>
            <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                    <button
                        key={index}
                        onClick={() => toggleChip(chip)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${selectedChips.has(chip)
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        {selectedChips.has(chip) && '✓ '}
                        {chip}
                    </button>
                ))}
            </div>
        </div>
    );
}
