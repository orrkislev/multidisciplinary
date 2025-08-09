'use client'

import { useState, useEffect, useRef } from 'react';
import List from './List';
import NewListForm from './NewListForm';
import { experimental_useObject as useObject } from 'ai/react';
import { boardSchema } from '../schema';
import { Sparkle } from 'lucide-react';

export default function BoardPage() {
    const [lists, setLists] = useState([
        { id: 1, title: 'To Do', items: [{ id: 1, content: 'Task 1' }] },
        { id: 2, title: 'In Progress', items: [{ id: 2, content: 'Task 2' }] },
        { id: 3, title: 'Done', items: [] }
    ]);
    const [changeLog, setChangeLog] = useState([]);
    const ai = useObject({
        api: '/api/board',
        schema: boardSchema,
        onFinish: (object, error) => {
            // Merge lists from ai.object into the current lists
            if (object && object.object && Array.isArray(object.object.lists)) {
                setLists(prevLists => {
                    // Merge by id: update existing, add new, keep others
                    const aiLists = object.object.lists;
                    const merged = [...prevLists];
                    aiLists.forEach(aiList => {
                        const idx = merged.findIndex(l => l.id === aiList.id);
                        if (idx !== -1) {
                            merged[idx] = { ...merged[idx], ...aiList };
                        } else {
                            merged.push(aiList);
                        }
                    });
                    return merged;
                });
            }
            console.log(object.object);
        }
    });
    const submitCounter = useRef(0);

    const updateStuff = (newLists, newChange) => {
        setLists(newLists);
        setChangeLog(log => [log[1], log[2], newChange]);
        submitCounter.current++;
        // if (submitCounter.current % 3 === 0) {
        //     ai.submit({
        //         lists: newLists,
        //         changes: [newChange]
        //     });
        // }
    }

    const handleListChange = (updatedList, logMessage) => {
        updateStuff(lists.map(l => l.id === updatedList.id ? updatedList : l), logMessage);
    };
    const handleRemoveList = (listId, listTitle) => {
        updateStuff(lists.filter(l => l.id !== listId), `Removed list: "${listTitle}"`);
    };
    const addList = (title) => {
        const newId = Math.max(...lists.map(list => list.id)) + 1;
        updateStuff([...lists, { id: newId, title, items: [] }], `Added list: "${title}"`);
    };

    const handleAI = (e) => {
        e.preventDefault();
        ai.submit({
            lists,
            changes: changeLog
        });
    }

    // Responsive columns
    const [numColumns, setNumColumns] = useState(3);
    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 640) setNumColumns(1);
            else if (window.innerWidth < 900) setNumColumns(2);
            else setNumColumns(3);
        };
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Distribute lists into columns (round-robin)
    const getMasonryColumns = (lists, numColumns) => {
        const cols = Array.from({ length: numColumns }, () => []);
        lists.forEach((list, idx) => {
            cols[idx % numColumns].push(list);
        });
        return cols;
    };
    const columns = getMasonryColumns(lists, numColumns);

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="container mx-auto px-4">
                <div className="flex justify-center">
                    <div className="flex gap-3 w-full max-w-5xl">
                        {columns.map((col, colIdx) => (
                            <div key={colIdx} className="flex-1 flex flex-col gap-4">
                                {col.map((list) => (
                                    <div key={list.id} className="break-inside-avoid mb-0">
                                        <List
                                            list={list}
                                            onChange={handleListChange}
                                            onRemove={handleRemoveList}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <NewListForm onAddList={addList} newListName={ai.object?.newListName} />
            </div>
            {/* Floating Action Button for AI Action */}
            <button
                onClick={handleAI}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Run AI Action"
            >
                <span className="sr-only">Run AI Action</span>
                <Sparkle className="w-8 h-8" />
            </button>
            {/* Questions from ai.object */}
            {ai.object && ai.object.questions && Array.isArray(ai.object.questions) && (
                <div style={{ position: 'fixed', bottom: 20, left: 20, width: 320, maxHeight: 300, overflowY: 'auto', background: 'rgba(255,255,255,0.95)', border: '1px solid #ddd', borderRadius: 8, padding: 12, fontSize: 12, zIndex: 100 }}>
                    <strong>AI Questions</strong>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {ai.object.questions.map((q, idx) => (
                            <li key={idx} style={{ marginBottom: 4 }}>{q}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
