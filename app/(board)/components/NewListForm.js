'use client'

import { useState } from 'react';

const NewListForm = ({ onAddList }) => {
    const [newListTitle, setNewListTitle] = useState('');

    const handleAddList = () => {
        if (!newListTitle.trim()) return;
        onAddList(newListTitle);
        setNewListTitle('');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-72">
            <h3 className="text-lg font-bold mb-3 text-gray-800">Add New List</h3>
            <div className="flex bg-gray-50 rounded-full border border-gray-200 shadow-sm overflow-hidden">
                <input 
                    placeholder="List title" 
                    value={newListTitle} 
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddList()}
                    className="flex-1 py-2 px-4 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                />
                <button 
                    onClick={handleAddList}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 text-sm font-medium"
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default NewListForm;