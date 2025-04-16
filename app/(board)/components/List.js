'use client'

import ListItem from './ListItem';
import NewItemForm from './NewItemForm';

const List = ({ list, lists, newItemText, setNewItemText, onAdd, onEdit, onRemove, onMove, editingItemId, editingText, setEditingText, onSaveEdit }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 w-72 flex flex-col">
            <h3 className="text-lg font-bold mb-3 text-gray-800">{list.title}</h3>
            <div className="flex-1">
                {list.items.map(item => (
                    <ListItem 
                        key={item.id}
                        item={item}
                        list={list}
                        lists={lists}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onMove={onMove}
                        isEditing={editingItemId === item.id}
                        editText={editingText}
                        setEditText={setEditingText}
                        onSaveEdit={onSaveEdit}
                    />
                ))}
            </div>
            <NewItemForm 
                newItemText={newItemText}
                setNewItemText={setNewItemText}
                onAdd={onAdd}
                listId={list.id}
            />
        </div>
    );
};

export default List;