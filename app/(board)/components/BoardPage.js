'use client'

import { useState } from 'react';
import List from './List';
import NewListForm from './NewListForm';

export default function BoardPage() {
    const [lists, setLists] = useState([
        { id: 1, title: 'To Do', items: [{ id: 1, content: 'Task 1' }] },
        { id: 2, title: 'In Progress', items: [{ id: 2, content: 'Task 2' }] },
        { id: 3, title: 'Done', items: [] }
    ]);
    const [newItemText, setNewItemText] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingText, setEditingText] = useState('');

    const addItem = (listId) => {
        if (!newItemText.trim()) return;
        const newItem = { id: Date.now(), content: newItemText };
        setLists(lists.map(list =>
            list.id === listId ? { ...list, items: [...list.items, newItem] } : list
        ));
        setNewItemText('');
    };

    const addList = (title) => {
        const newId = Math.max(...lists.map(list => list.id)) + 1;
        setLists([...lists, { id: newId, title, items: [] }]);
    };

    const removeItem = (listId, itemId) => {
        setLists(lists.map(list =>
            list.id === listId ? { ...list, items: list.items.filter(item => item.id !== itemId) } : list
        ));
    };

    const startEditing = (itemId, currentContent) => {
        setEditingItemId(itemId);
        setEditingText(currentContent);
    };

    const saveEditing = (listId, itemId) => {
        setLists(lists.map(list =>
            list.id === listId ? { ...list, items: list.items.map(item => item.id === itemId ? { ...item, content: editingText } : item) } : list
        ));
        setEditingItemId(null);
        setEditingText('');
    };

    const moveItem = (fromListId, toListId, item) => {
        setLists(lists.map(list => {
            if (list.id === fromListId) {
                return { ...list, items: list.items.filter(i => i.id !== item.id) };
            }
            if (list.id === toListId) {
                return { ...list, items: [...list.items, item] };
            }
            return list;
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Board</h2>
                <div className="flex flex-wrap gap-6">
                    {lists.map((list) => (
                        <List 
                            key={list.id}
                            list={list}
                            lists={lists}
                            newItemText={newItemText}
                            setNewItemText={setNewItemText}
                            onAdd={addItem}
                            onEdit={startEditing}
                            onRemove={removeItem}
                            onMove={moveItem}
                            editingItemId={editingItemId}
                            editingText={editingText}
                            setEditingText={setEditingText}
                            onSaveEdit={saveEditing}
                        />
                    ))}
                    <NewListForm onAddList={addList} />
                </div>
            </div>
        </div>
    );
}
