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
            <div className='display text-4xl md:text-6xl text-center mb-6 px-4'>
                What are you working on?
            </div>

            <form onSubmit={handleSubmit} className="flex flex-wrap justify-center items-center gap-3 px-4">
                <input type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="field w-80 md:w-[26rem]"
                />
                <button type="submit" className="pebble-btn group">
                    Start
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
            </form>
        </div>
    )
}