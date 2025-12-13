import { GoogleGenerativeAI } from "@google/generative-ai";

// Utility to sanitize prompt strings for directory names.
function sanitizePrompt(prompt) {
    return prompt.replace(/[^a-zA-Z0-9]/g, '_');
}

// Function to fetch an image from file if it exists.
function fetchImageFromFile(prompt) {
    const fs = require('fs');
    const path = require('path');
    const directoryName = sanitizePrompt(prompt);
    const directoryPath = path.join(process.cwd(), 'public', directoryName);
    if (fs.existsSync(directoryPath)) {
        const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.png'));
        if (files.length > 0) {
            const randomIndex = Math.floor(Math.random() * files.length);
            const filePath = path.join(directoryPath, files[randomIndex]);
            const base64data = fs.readFileSync(filePath, { encoding: 'base64' });
            return "data:image/png;base64," + base64data;
        }
    }
    return null;
}

// Function to save an image to file.
function saveImageToFile(prompt, imageData) {
    const fs = require('fs');
    const path = require('path');
    const directoryName = sanitizePrompt(prompt);
    const directoryPath = path.join(process.cwd(), 'public', directoryName);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
    let fileNumber = 1;
    let filePath;
    do {
        const filename = String(fileNumber).padStart(4, '0') + '.png';
        filePath = path.join(directoryPath, filename);
        fileNumber++;
    } while (fs.existsSync(filePath));
    fs.writeFileSync(filePath, imageData, 'base64');
}

export async function POST(req) {
    const { prompt } = await req.json();
    if (!prompt) {
        return new Response(JSON.stringify({ error: 'No prompt provided' }), { status: 400 });
    }

    // Attempt to fetch an existing image from file.
    // const existingImage = fetchImageFromFile(prompt);
    // if (existingImage) {
    //     return new Response(JSON.stringify({ image: existingImage }), { status: 200 });
    // }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-exp-image-generation",
        generationConfig: {
            responseModalities: ['Text', 'Image']
        },
    });

    const contents = "Hi, create an image using the following prompt: " + prompt;
    try {
        const result = await model.generateContent(contents);
        let imageDataUri = "";
        for (const part of result.response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageDataUri = "data:image/png;base64," + part.inlineData.data;
                // saveImageToFile(prompt, part.inlineData.data);
                break;
            }
        }
        if (imageDataUri) {
            return new Response(JSON.stringify({ image: imageDataUri }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: 'No image generated' }), { status: 500 });
        }
    } catch (error) {
        console.error("Error generating image:", error);
        return new Response(JSON.stringify({ error: "Error generating image" }), { status: 500 });
    }
}