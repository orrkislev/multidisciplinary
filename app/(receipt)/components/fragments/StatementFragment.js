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
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-lg text-slate-800 mb-4 font-medium">
                "{statement}"
            </p>

            <div className="flex gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${selected === option.value
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
