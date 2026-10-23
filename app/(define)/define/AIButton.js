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
            <button className="pebble-btn relative z-100">
                <Loader2 className="w-4 h-4 animate-spin" />
            </button>
        )
    }

    return (
        <button onClick={handleClick} className="pebble-btn relative z-100">
            Get Suggestions
            <Sparkle className="w-4 h-4" />

            {showLabel && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-bounce">
                    <div className="font-hand text-lg bg-paper px-3 py-0.5 rounded-full whitespace-nowrap">
                        Get suggestions from the AI
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-paper mx-auto"></div>
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
        <button onClick={handleClick} className="pebble-btn-soft relative z-100">
            Clear
            <Trash2 className="w-3 h-3" />

            {showLabel && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-bounce">
                    <div className="font-hand text-lg bg-paper px-3 py-0.5 rounded-full whitespace-nowrap">
                        First, clear the text
                    </div>
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-paper mx-auto"></div>
                </div>
            )}
        </button>
    )
}