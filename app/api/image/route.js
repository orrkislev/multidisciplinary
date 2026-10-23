// Plate illustrations via Gemini's image model. Returns { image: base64, mimeType }.
const MODEL = 'gemini-3.1-flash-lite-image';

export const maxDuration = 60;

export async function POST(req) {
    const { prompt, aspectRatio = '1:1' } = await req.json();
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 2000) {
        return Response.json({ error: 'Send a prompt up to 2000 characters.' }, { status: 400 });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'x-goog-api-key': process.env.GOOGLE_GENERATIVE_AI_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio } },
        }),
    });
    const json = await res.json();
    const data = json?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData;
    if (!data) return Response.json({ error: 'The image model returned no image.' }, { status: 502 });
    return Response.json({ image: data.data, mimeType: data.mimeType });
}
