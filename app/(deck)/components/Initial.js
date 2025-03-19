import { on } from "events";
import { useState } from "react";

export default function Initial({onInitial}) {
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        onInitial(description);
    }
    
    return (
        <div className='absolute w-full h-full flex flex-col items-center justify-center p-8 bg-gray-300'>

            <div className='text-2xl font-bold mb-4'>
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
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                    Submit
                </button>
            </form>
        </div>
    )
}