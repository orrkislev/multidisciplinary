import { Amphora } from "lucide-react";
import Link from "next/link";

export default function HomeButton() {
    return (
        <Link href="/">
            <div className="fixed bottom-8 right-6 p-2 bg-white rounded-lg flex items-center gap-2 group shadow-[1px_1px_0_rgba(0,0,0,0.1)] hover:shadow-[5px_5px_0_rgba(0,0,0,0.2)] transition-all">
                <Amphora className="w-8 h-8 text-red-500 group-hover:rotate-45 transition-all" />
                <div className="flex flex-col">
                    <div className="text-xs text-red-500 group-hover:ml-2 transition-all delay-100">part of</div>
                    <div className="text-sm text-red-500 group-hover:ml-2 transition-all delay-100">the Serendipity Engine</div>
                </div>
            </div>
        </Link>
    )
}