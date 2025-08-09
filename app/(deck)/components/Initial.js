import { on } from "events";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Initial({onInitial}) {
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        onInitial("I am working on " + description);
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <div className='text-2xl font-bold mb-4 text-red-800'>
                WHAT ARE YOU WORKING ON?
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="bg-white px-4 py-2 border border-red-300 rounded-lg mr-2 w-[400px]"
                />
                <button type="submit" className="px-4 py-2 rounded-lg hover:bg-red-200 transition duration-200 flex items-center gap-2 group">
                    Submit
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
            </form>
        </div>
    )
}