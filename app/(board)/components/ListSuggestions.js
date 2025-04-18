'use client'

const ListSuggestions = ({ suggestions, onSelectSuggestion }) => {
    return (
        <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Suggestions</h4>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button 
                        key={index} 
                        onClick={() => onSelectSuggestion(suggestion)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-full border border-gray-200"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListSuggestions;