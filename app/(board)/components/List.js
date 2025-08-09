'use client'

import ListItem from './ListItem';
import NewItemForm from './NewItemForm';
import ListTitle from './ListTitle';

const List = ({ list, onChange, onRemove }) => {
    // Handler for title change
    const handleTitleChange = (title) => {
        const oldTitle = list.title;
        const newList = { ...list, title };
        onChange(newList, `Changed list title: "${oldTitle}" → "${title}"`);
    };

    // Handler for adding an item
    const handleAddItem = (text) => {
        const newItem = { id: Date.now(), content: text };
        const newList = { ...list, items: [...list.items, newItem] };
        onChange(newList, `Added item to "${list.title}": ${text}`);
    };

    // Handler for removing an item
    const handleRemoveItem = (itemId) => {
        const item = list.items.find(i => i.id === itemId);
        const newList = { ...list, items: list.items.filter(item => item.id !== itemId) };
        onChange(newList, `Removed item from "${list.title}": ${item?.content || 'Unknown'}`);
    };

    // Handler for changing an item
    const handleItemChange = (itemId, newContent) => {
        const item = list.items.find(i => i.id === itemId);
        const newList = {
            ...list,
            items: list.items.map(item => item.id === itemId ? { ...item, content: newContent } : item)
        };
        onChange(newList, `Changed item in "${list.title}": "${item?.content}" → "${newContent}"`);
    };

    return (
        <div className="group bg-white rounded-lg shadow-md p-4 w-72 flex flex-col relative">
            <button
                onClick={() => onRemove(list.id, list.title)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full p-1 z-10"
                aria-label="Remove list"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6" /></svg>
            </button>
            <ListTitle title={list.title} onChange={handleTitleChange} />
            {list.description && (
                <div className="text-xs text-gray-500 mb-2">{list.description}</div>
            )}
            <div className="flex-1">
                {list.items.map(item => (
                    <ListItem 
                        key={item.id}
                        content={item.content}
                        onChange={newContent => handleItemChange(item.id, newContent)}
                        onRemove={() => handleRemoveItem(item.id)}
                    />
                ))}
            </div>
            <NewItemForm 
                onAdd={handleAddItem}
                listId={list.id}
                suggestions={list.suggestions}
            />
        </div>
    );
};

export default List;