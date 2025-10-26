'use client'

import { useData } from "../utils/store";
import MergeMenu from "./MergeMenu";
import Subjects from "./Subjects";

export default function SideBar() {
    const currentMerge = useData(state => state.getActiveMerge());

    const hasTwoSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div className="h-screen relative flex flex-col gap-2 border-r border-neutral-300 w-1/8">
            {hasTwoSubjects ? <MergeMenu /> : <Subjects />}
        </div>
    )
}