import RightSide from "../components/RightSide";
import Subjects from "../components/Subjects";

export const metadata = {
  title: "Interdisciplinary - Serendipity Engine",
  description: "Interdisciplinary is a serendipity engine that helps you find new ideas and connections."
}

export default function InterdisciplinaryPage() {
    return (
        <div className="flex flex-col md:flex-row w-full h-auto md:h-screen bg-slate-200 transition-all duration-300">
            <div className={`overflow-y-auto h-[80vh] md:h-full md:flex-[1]`}>
                <Subjects />
            </div>
            <div className={`overflow-y-auto md:flex-[2]`}>
                <RightSide />
            </div>
        </div>
    );
}
