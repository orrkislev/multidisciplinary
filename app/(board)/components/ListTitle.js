import { useState, useRef, useEffect } from 'react';

const ListTitle = ({ title, onChange }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(title);
    const inputRef = useRef(null);

    useEffect(() => {
        setValue(title);
    }, [title]);

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

    const finishEdit = () => {
        setEditing(false);
        if (value !== title) {
            onChange(value);
        }
    };

    return (
        <div className="mb-3">
            {editing ? (
                <div className="relative">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        className="text-lg font-bold text-red-800 bg-transparent border-none focus:ring-0 focus:outline-none pb-2 w-full"
                        autoFocus
                        onBlur={finishEdit}
                    />
                    <div className="absolute left-0 right-0 bottom-0 h-1 bg-blue-500 rounded-b-full pointer-events-none" />
                </div>
            ) : (
                <h3
                    className="text-lg font-bold text-red-800 cursor-pointer"
                    onClick={() => setEditing(true)}
                >
                    {title}
                </h3>
            )}
        </div>
    );
};

export default ListTitle;
