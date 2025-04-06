export async function POST(req) {
    const data = await req.json();
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST requests are allowed" });
    if (!data.prompt) return Response.json({ error: 'Missing prompt' });

    // const url = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
    const url = 'https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image';

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.GETIMG_API_KEY}`
        },
        body: JSON.stringify(data)
    };

    const res = await fetch(url, options)
    const json = await res.json();
    return Response.json(json);
}