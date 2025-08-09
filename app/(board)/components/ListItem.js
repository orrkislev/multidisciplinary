'use client'

import { Trash2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const ListItem = ({ content, onChange, onRemove }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(content);
    const inputRef = useRef(null);

    // Keep value in sync if content changes from outside
    useEffect(() => {
        setValue(content);
    }, [content]);

    // Save on click outside
    useEffect(() => {
        if (!editing) return;
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                finishEdit();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editing, value]);

    // Save and exit edit mode
    const finishEdit = () => {
        setEditing(false);
        if (value !== content) {
            onChange(value);
        }
    };

    return (
        <div className={`group bg-white rounded-full px-3 h-[2em] border border-gray-200 shadow-sm flex items-center justify-between ${editing ? 'border-b-[5px] border-blue-500' : ''}`}>
            {editing ? (
                <div className="flex w-full items-center relative">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="flex-1 border-none focus:ring-0 focus:outline-none rounded-full py-1 px-2 bg-transparent pb-2"
                        autoFocus
                        onBlur={finishEdit}
                    />
                </div>
            ) : (
                <div className="flex items-center w-full">
                    <span
                        className="flex-1 text-gray-700 truncate cursor-pointer"
                        onClick={() => setEditing(true)}
                    >
                        {content}
                    </span>
                    <div className="flex space-x-1 ml-2">
                        <button
                            onClick={onRemove}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                            aria-label="Remove"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListItem;