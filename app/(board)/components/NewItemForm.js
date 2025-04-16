'use client'

import { useState } from 'react';
import ListSuggestions from './ListSuggestions';

const NewItemForm = ({ newItemText, setNewItemText, onAdd, listId }) => {
    const [suggestions, setSuggestions] = useState([
        'Update documentation',
        'Review code',
        'Implement feature',
        'Fix bug',
        'Design UI',
        'Plan sprint'
    ]);

    const handleSelectSuggestion = (suggestion) => {
        setNewItemText(suggestion);
    };

    return (
        <div className="mt-3">
            <div className="flex bg-gray-50 rounded-full border border-gray-200 shadow-sm overflow-hidden">
                <input 
                    placeholder="New item" 
                    value={newItemText} 
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onAdd(listId)}
                    className="flex-1 py-2 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                />
                <button 
                    onClick={() => onAdd(listId)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-sm font-medium"
                >
                    Add
                </button>
            </div>
            <ListSuggestions 
                suggestions={suggestions}
                onSelectSuggestion={handleSelectSuggestion}
            />
        </div>
    );
};

export default NewItemForm;