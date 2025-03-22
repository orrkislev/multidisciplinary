import { on } from "events";
import { useState } from "react";

export default function Initial({onInitial}) {
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        onInitial(description);
    }
    
    return (
        <div className='absolute w-full h-full flex flex-col items-center justify-center p-8 bg-[#0e5a2a]'
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), radial-gradient(circle at center, #157a3e 0%, #0e5a2a 100%)`
            }}>

            <div className='text-2xl font-bold mb-4 text-white'>
                WHAT ARE YOU WORKING ON?
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project..."
                    className="bg-white px-4 py-2 border border-gray-300 rounded-lg mr-2 w-[400px]"
                />
                <button type="submit" 
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-white transition duration-200">
                    Submit
                </button>
            </form>
        </div>
    )
}