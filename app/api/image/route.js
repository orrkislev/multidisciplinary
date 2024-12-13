// curl --request POST \
//      --url https://api.getimg.ai/v1/enhancements/upscale \
//      --header 'authorization: Bearer $ACCESS_TOKEN' \
//      --header 'accept: application/json' \
//      --header 'content-type: application/json' \
//      --data '{"image": "base64 encoded image"}' 


export async function POST(req) {
    const data = await req.json();
    if (req.method !== "POST")
        return res.status(405).json({ message: "Only POST requests are allowed" });

    const { subject1, subject2, newName } = data;
    if (!subject1 || !subject2 || !newName)
        return Response.json({ error: 'Missing subject1 or subject2' });

    let prompt = `a photograph representing ${newName}, a fusion between ${subject1} and ${subject2}. `;
    prompt += 'paster colors, and a soft, dreamy aesthetic. ';
    prompt += 'no text, no logos, no watermarks. ';

    const url = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
    const options = {
        method: 'POST',
        headers: { 
            accept: 'application/json', 
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.GETIMG_API_KEY}`
        },
        body: JSON.stringify({ prompt })
    };

    const res = await fetch(url, options)
    const json = await res.json();
    console.log(json)
    return Response.json(json);
}