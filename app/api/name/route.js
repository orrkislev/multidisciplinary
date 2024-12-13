import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
    const data = await req.json();
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST requests are allowed" });

    if (data.action == 'name') {
        const { subject1, subject2 } = data;

        let prompt = `Come up with names for the topic of interest that is the fusion between ${subject1} and ${subject2}. `
        prompt += 'The names should be academic and professional sounding. ';
        prompt += 'return just the list of names, sperated by commas. without any other text.';

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            const names = text.split(',').map(name => name.trim());
            return Response.json({ names });
        } catch (error) {
            return Response.json({ error: 'Error generating content' });
        }
    } else if (data.action == 'description') {
        const { subject1, subject2, name } = data;

        let prompt = `write a brief wikipedia-like description about ${name}. (the fusion between ${subject1} and ${subject2})`;
        prompt += 'The description should be professional, short, and easy to understand. ';
        prompt += 'return just the description, without any other text.';

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return Response.json({ text });
        } catch (error) {
            return Response.json({ error: 'Error generating content' });
        }
    } else if (data.action == 'projects'){
        const { subject1, subject2, name } = data;
        let prompt = `List some beginner level projects that can be done in the field of ${name} (the fusion between ${subject1} and ${subject2}). `;
        prompt += 'The projects should be simple, easy to understand, and beginner friendly. ';
        prompt += 'respond with a json object with the key "projects" and the value as an array of projects name and description. ';
        prompt += 'respond with just the json object, without any other text.';

        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text().replace('```json\n', '').replace('```', '').trim();
            const projects = JSON.parse(text)
            console.log(projects);
            return Response.json({ projects });
        } catch (error) {
            return Response.json({ error: 'Error generating content' });
        }
    }
}

