import Main from "../components/Main";
import SideBar from "../components/SideBar";
import HomeButton from "@/app/(__components)/HomeButton";

export const metadata = {
    title: "Interdisciplinary - Serendipity Engine",
    description: "Interdisciplinary is a serendipity engine that helps you find new ideas and connections."
}

export default function InterdisciplinaryPage() {
    return (
        <div className="flex w-full h-full">
            <SideBar />
            <Main />
            {/* <HomeButton /> */}
        </div>
    );
}
