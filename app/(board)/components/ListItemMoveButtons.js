'use client'

const ListItemMoveButtons = ({ list, item, lists, onMove }) => {
    return (
        <>
            {lists.find(l => l.id === list.id - 1) && (
                <button 
                    onClick={() => onMove(list.id, list.id - 1, item)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1"
                >
                    ←
                </button>
            )}
            {lists.find(l => l.id === list.id + 1) && (
                <button 
                    onClick={() => onMove(list.id, list.id + 1, item)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-2 py-1"
                >
                    →
                </button>
            )}
        </>
    );
};

export default ListItemMoveButtons;