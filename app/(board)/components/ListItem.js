'use client'

import ListItemMoveButtons from './ListItemMoveButtons';

const ListItem = ({ item, list, lists, onEdit, onRemove, onMove, isEditing, editText, setEditText, onSaveEdit }) => {
    return (
        <div className="bg-white rounded-full py-2 px-4 mb-2 border border-gray-200 shadow-sm flex items-center justify-between">
            {isEditing ? (
                <div className="flex w-full items-center">
                    <input 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 border-none focus:ring-0 focus:outline-none rounded-full py-1 px-2 text-sm"
                    />
                    <button 
                        onClick={() => onSaveEdit(list.id, item.id)}
                        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full px-3 py-1"
                    >
                        Save
                    </button>
                </div>
            ) : (
                <div className="flex items-center w-full">
                    <span className="flex-1 text-gray-700 truncate">{item.content}</span>
                    <div className="flex space-x-1 ml-2">
                        <button 
                            onClick={() => onEdit(item.id, item.content)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => onRemove(list.id, item.id)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1"
                        >
                            Remove
                        </button>
                        <ListItemMoveButtons 
                            list={list} 
                            item={item} 
                            lists={lists} 
                            onMove={onMove} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListItem;