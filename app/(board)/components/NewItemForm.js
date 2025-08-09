'use client'

import { useState } from 'react';
import ListSuggestions from './ListSuggestions';

const NewItemForm = ({ onAdd, suggestions }) => {
    const [newItemText, setNewItemText] = useState("");

    const handleSelectSuggestion = (suggestion) => {
        onAdd(suggestion);
    };

    const handleInputAdd = () => {
        if (!newItemText.trim()) return;
        onAdd(newItemText);
        setNewItemText("");
    };

    return (
        <div className="mt-3">
            <div className="flex bg-gray-50 rounded-full border border-gray-200 shadow-sm overflow-hidden">
                <input 
                    placeholder="New item" 
                    value={newItemText} 
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleInputAdd()}
                    className="flex-1 py-2 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                />
                <button 
                    onClick={handleInputAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-sm font-medium"
                >
                    Add
                </button>
            </div>
            <ListSuggestions onSelectSuggestion={handleSelectSuggestion} suggestions={suggestions} />
        </div>
    );
};

export default NewItemForm;