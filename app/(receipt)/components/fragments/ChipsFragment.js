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
        <div className="paper p-6 animate-fade-in">
            <h3 className="font-mono text-[0.65rem] text-ink-soft mb-4 uppercase tracking-wider">
                Skills & Concepts
            </h3>
            <div className="flex flex-wrap gap-2">
                {chips.map((chip, index) => (
                    <button
                        key={index}
                        onClick={() => toggleChip(chip)}
                        className={`knead px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${selectedChips.has(chip)
                            ? 'bg-ink text-paper'
                            : 'bg-stone hover:bg-stone'
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
