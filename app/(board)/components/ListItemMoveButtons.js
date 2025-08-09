'use client'

const ListItemMoveButtons = ({ list, item, lists, onMove }) => {
    return (
        <>
            {lists.find(l => l.id === list.id - 1) && (
                <button 
                    onClick={() => onMove(list.id, list.id - 1, item)}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full px-2 py-1"
                >
                    ←
                </button>
            )}
            {lists.find(l => l.id === list.id + 1) && (
                <button 
                    onClick={() => onMove(list.id, list.id + 1, item)}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-600 rounded-full px-2 py-1"
                >
                    →
                </button>
            )}
        </>
    );
};

export default ListItemMoveButtons;