import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export async function POST(req) {
  const data = await req.json();
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST requests are allowed" });

  try {
    let prompt = `give me a list of subjects or topics of interest related to '${data.input}'. `;
    prompt += 'The list should be academic and professional sounding, just one or two words each. ';
    prompt += 'return just the list of names, sperated by commas. without any other text.';


    const chatCompletion = await reqGroqAI(prompt);
    const text = chatCompletion.choices[0]?.message?.content || "";
    const names = text.split(',').map(name => name.trim());
    return Response.json({ names });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}


const reqGroqAI = async (content) => {
  const res = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "llama-3.1-8b-instant",
  });
  return res;
};