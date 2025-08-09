'use client'

import { useState } from 'react';

const ListSuggestions = ({ onSelectSuggestion, suggestions }) => {
    const [internalSuggestions, setInternalSuggestions] = useState([]);
    const displaySuggestions = Array.isArray(suggestions) && suggestions.length > 0 ? suggestions : internalSuggestions;
    if (!displaySuggestions || displaySuggestions.length === 0) return null;
    return (
        <div className="mt-3">
            <h4 className="text-sm font-medium text-red-600 mb-2">Suggestions</h4>
            <div className="flex flex-wrap gap-2">
                {displaySuggestions.map((suggestion, index) => (
                    <button 
                        key={index} 
                        onClick={() => onSelectSuggestion(suggestion)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-3 py-1.5 rounded-full border border-red-200"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListSuggestions;