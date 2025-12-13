import { Loader2, Sparkle, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AIButton({ onClick, isLoading }) {
    const [showLabel, setShowLabel] = useState(true);

    const handleClick = () => {
        setShowLabel(false);
        onClick();
    };

    if (isLoading) {
        return (
            <button className="relative flex gap-2 items-center px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600 transition-all hover:-translate-y-1 cursor-pointer z-100">
                <Loader2 className="w-4 h-4 animate-spin" />
            </button>
        )
    }

    return (
        <button onClick={handleClick} className="relative flex gap-2 items-center px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600 transition-all hover:-translate-y-1 cursor-pointer z-100">
            Get Suggestions
            <Sparkle className="w-4 h-4" />

            {showLabel && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-bounce">
                    <div className="text-xs bg-white px-2 py-1 text-black rounded whitespace-nowrap">
                        Get suggestions from the AI
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white mx-auto"></div>
                </div>
            )}
        </button>
    )
}

export function ClearButton({ onClick }) {
    const [showLabel, setShowLabel] = useState(true);

    const handleClick = () => {
        setShowLabel(false);
        onClick();
    };

    return (
        <button onClick={handleClick} className="relative flex gap-2 items-center px-4 py-2 bg-neutral-200 text-sm text-neutral-800 rounded hover:bg-neutral-800 hover:text-white transition-all hover:-translate-y-1 cursor-pointer z-100">
            Clear
            <Trash2 className="w-3 h-3" />

            {showLabel && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-bounce">
                    <div className="text-xs bg-white px-2 py-1 text-black rounded whitespace-nowrap">
                        First, clear the text
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white mx-auto"></div>
                </div>
            )}
        </button>
    )
}