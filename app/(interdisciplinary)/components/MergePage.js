import { useData } from "../utils/store";
import SubjectCard from "../sections/1 - SubjectCard";
import SubjectDescription from "../sections/2 - SubjectDescription";
import Timeline from "../sections/3 - Timeline";
import Terminology from "../sections/4 - Terminology";
import Questions from "../sections/5 - Questions";
import Projects from "../sections/7 - Projects";

export default function MergePage() {
    const currentMerge = useData(state => state.getActiveMerge());

    const hasBothSubjects = currentMerge?.subjects?.length >= 2;

    return (
        <div className="h-full overflow-y-auto flex flex-col gap-8 px-8 py-2 font-geist z-1 pb-16">
            <SubjectCard />
            <SubjectDescription />
            <Timeline />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Terminology />
                <Questions />
            </div>
            <Projects />
        </div>
    )
}