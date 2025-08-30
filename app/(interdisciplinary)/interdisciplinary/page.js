import Link from "next/link";
import RightSide from "../components/RightSide";
import Subjects from "../components/Subjects";
import { Amphora } from "lucide-react";
import HomeButton from "@/app/(__components)/HomeButton";

export const metadata = {
    title: "Interdisciplinary - Serendipity Engine",
    description: "Interdisciplinary is a serendipity engine that helps you find new ideas and connections."
}

export default function InterdisciplinaryPage() {
    return (
        <div className="flex w-full h-full">
            <RightSide />
            <Subjects />
            <HomeButton />
        </div>
    );
}
