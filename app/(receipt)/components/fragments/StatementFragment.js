'use client';

import { useState } from 'react';
import useReceiptStore from '../../utils/receiptStore';

export default function StatementFragment({ statement, fragmentId }) {
    const [selected, setSelected] = useState(null);
    const { recordResponse, addReceiptItem, markFragmentUsed } = useReceiptStore();

    const options = [
        { label: 'Disagree', value: 0 },
        { label: 'Somewhat', value: 1 },
        { label: 'Yes, exactly', value: 2 }
    ];

    const handleSelect = (option) => {
        setSelected(option.value);
        markFragmentUsed(fragmentId);
        recordResponse(fragmentId, 'statement', { statement, response: option.label });

        // Add to receipt if strongly agreed
        if (option.value === 2) {
            addReceiptItem('process', {
                label: statement,
                quantity: '✓',
                editable: true
            });
        }
    };

    return (
        <div className="paper p-6 animate-fade-in">
            <p className="text-lg mb-4 font-medium leading-snug">
                "{statement}"
            </p>

            <div className="flex gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`knead flex-1 py-2 px-3 rounded-full text-sm font-medium cursor-pointer ${selected === option.value
                                ? 'bg-ink text-paper'
                                : 'bg-stone hover:bg-stone'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
