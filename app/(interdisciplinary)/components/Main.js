'use client'

import { Plus, X } from "lucide-react";
import { dataActions, useData } from "../utils/store";
import MergePage from "./MergePage";

export default function Main() {

    return (
        <div className="flex-1 h-screen relative bg-primary-50">
            <Tabs />
            <MergePage />
        </div>
    )
}


function Tabs() {
    const merges = useData(state => state.merges);
    const activeMerge = useData(state => state.getActiveMerge());

    const handleAddMerge = () => dataActions.newMerge();

    return (
        <div className="absolute top-0 left-0 w-full bg-white">
            <div className="sticky top-0 border-b border-neutral-300 flex">
                {merges.map(merge => (
                    <Tab key={merge.id} merge={merge} active={activeMerge.id === merge.id} withClose={merges.length > 1} />
                ))}
                <button className="px-2 py-1 text-xs border-neutral-300 relative cursor-pointer group/tab hover:bg-neutral-100" onClick={handleAddMerge}>
                    <Plus className="w-4 h-4 text-neutral-500 group-hover/tab:text-neutral-700 transition-all duration-300 group-hover/tab:rotate-90" />
                </button>
            </div>
        </div>
    )
}

function Tab({ merge, active, withClose = true }) {

    const handleClose = () => dataActions.removeMerge(merge.id);

    return (
        <div className={`pl-2 pr-6 py-1 border-r text-xs border-neutral-300 relative cursor-pointer group/tab hover:bg-neutral-100 ${active ? 'bg-neutral-100' : 'hover:bg-neutral-100'}`}
            onClick={() => dataActions.setActiveMerge(merge.id)}
        >
            {merge.name}
            {withClose && (
                <button className="absolute top-1/2 -translate-y-1/2 right-1 bg-neutral-100 rounded-xs opacity-0 group-hover/tab:opacity-100 transition-opacity duration-300" onClick={handleClose}>
                    <X className="w-4 h-4 text-neutral-500" />
                </button>
            )}
        </div>
    )
}