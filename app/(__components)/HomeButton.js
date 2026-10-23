import Link from "next/link";

export default function HomeButton() {
    return (
        <Link
            href="/"
            aria-label="Back to the Serendipity Engine"
            className="group fixed bottom-5 right-5 z-[200] flex items-center h-12 pl-1.5 pr-3 rounded-full bg-paper text-ink shadow-[0_0_0_1px_rgb(36_32_30/0.15),0_8px_20px_-10px_rgb(36_32_30/0.4)] transition-all duration-500 ease-squish hover:pr-5 hover:shadow-[0_0_0_1.5px_#FF2D87,0_8px_20px_-10px_rgb(36_32_30/0.4)] active:scale-x-110 active:scale-y-90"
        >
            <img src="/cutouts/brain.webp" alt="" className="h-9 w-auto -my-2 transition-transform duration-500 ease-squish group-hover:scale-x-125 group-hover:scale-y-75 group-hover:-rotate-12" />
            <span className="display italic text-base max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-squish group-hover:max-w-48 group-hover:opacity-100 group-hover:ml-2">
                Serendipity Engine
            </span>
        </Link>
    )
}
