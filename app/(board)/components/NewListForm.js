'use client'

const DEFAULT_LIST_NAMES = [
    'Ideas', 'Backlog', 'Sprint', 'Review', 'Archive', 'Wishlist', 'Goals', 'Notes', 'Tasks', 'Inbox'
];

const NewListForm = ({ onAddList, newListName }) => {
    const getRandomListName = () => {
        return DEFAULT_LIST_NAMES[Math.floor(Math.random() * DEFAULT_LIST_NAMES.length)];
    };

    const handleAddList = () => {
        let title = newListName;
        if (!title) {
            title = getRandomListName();
        }
        title = window.prompt('Enter new list title:', title);
        if (title && title.trim()) {
            onAddList(title.trim());
        }
    };

    return (
        <div>
            <button
                onClick={handleAddList}
                className="fixed bottom-28 right-8 z-50 w-16 h-16 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-3xl hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Add New List"
            >
                <span className="sr-only">Add New List</span>
                {/* Lucide Plus icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
            {newListName && (
                <div className="fixed bottom-36 right-28 z-50 flex items-center">
                    {/* Lucide ArrowLeft icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600 mr-2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm shadow">{newListName}</span>
                </div>
            )}
        </div>
    );
};

export default NewListForm;