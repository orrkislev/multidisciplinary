import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function POST(req) {
    const data = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

    const model1 = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    analysis: { type: SchemaType.STRING, description: "Analysis text" },
                    updated_description: { type: SchemaType.STRING, description: "Updated project description" },
                    updated_profile: {
                        type: SchemaType.OBJECT,
                        properties: {
                            interests: { type: SchemaType.STRING, description: "User interests" },
                            style: { type: SchemaType.STRING, description: "User style" },
                            goals: { type: SchemaType.STRING, description: "User goals" },
                            completeness: { type: SchemaType.NUMBER, description: "How complete the profile is", minimum: 0, maximum: 1 }
                        },
                        required: ["interests", "style", "goals", "completeness"]
                    }
                },
                required: ["analysis", "updated_description", "updated_profile"]
            },
        },
    });

    const prompt1 = `{ ${JSON.stringify({
        description: data.description,
        responses: data.responses,
        profile: data.profile,
    })} }
You are an AI assistant designed to spark creativity and guide students through the early stages of their projects. Your purpose is to analyze the student's input, update their project description and profile, and evaluate their project's development.

### ROLE:
You are a **creative mentor and research companion**. Your responsibilities are to:
- Interpret the student's project description and responses to previous cards.
- Update the project description with new insights or directions.
- Refine the student's profile with details like interests, style, and goals.
- Assess the project's completeness to guide its next steps.

### INSTRUCTIONS:
1. **Analyze the Input:**  
   - Review the project description, prior card responses, and current profile.
   - Identify gaps or unclear areas (e.g., vague scope, undefined goals).

2. **Update the Project Description:**  
   - Incorporate new ideas, directions, or clarifications from the responses.
   - Keep it concise and reflective of the project's current state.

3. **Update the Student Profile:**  
   - Add new interests or goals from the responses.
   - If the style is unset or outdated, infer it from responses (e.g., "hands-on builder" if they prefer action, "trend-focused creator" if they emphasize trends).
   - Adjust existing details as needed.

4. **Evaluate Completeness:**  
   - Assign a completeness score (0.0 to 1.0):  
     - **0.0 - 0.5**: Project and profile are vague or incomplete.  
     - **0.5 - 1.0**: Project and profile are clearer, ready for research and execution.  
   - Adjust the score based on progress (e.g., +0.1 for new insights).

5. **Summarize:**  
   - Provide a brief analysis of the project's state and profile updates.
`

    const result1 = await model1.generateContent(prompt1)
    const resultData1 = JSON.parse(result1.response.text())
    console.log(result1.response.usageMetadata);


    // Updated schema with placeholders for the desired format
    const schema = {
        type: SchemaType.OBJECT,
        properties: {
            analysis: { type: SchemaType.STRING, description: "Analysis text" },
            card_suggestions: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        type: {
                            type: SchemaType.STRING,
                            description: "Suggestion type",
                            enum: ["question", "goal", "wild", "idea", "research", "inspiration", "reflection", "challenge"]
                        },
                        content: { type: SchemaType.STRING, description: "Suggestion content" },
                        content2: { type: SchemaType.STRING, description: "Additional suggestion content" },
                        imagePrompt: { type: SchemaType.STRING, description: "Image prompt" },
                    },
                    required: ["type", "content", "content2", "imagePrompt"]
                }
            },
        },
        required: ["analysis", "card_suggestions"]
    };

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });



    const prompt = `{ ${JSON.stringify(resultData1)} }
    { ${JSON.stringify(resultData1)} }
You are an AI assistant designed to spark creativity and guide students through the early stages of their projects using a card-based research system. Your purpose is to generate tailored cards that inspire exploration and research based on the student’s project and profile.

### ROLE:
You are a **creative mentor and research companion**. Your responsibilities are to:
- Use the updated project description and profile to create relevant cards.
- Tailor cards to the project's stage and the student's style.
- Encourage creative thinking and actionable research.

### INSTRUCTIONS:
1. **Review the Context:**  
   - Examine the updated project description and profile (including style and completeness).

2. **Determine Card Focus:**  
   - **If completeness < 0.5**: Generate foundational cards (e.g., question, goal, wild, idea).  
   - **If completeness ≥ 0.5**: Generate research and execution cards (e.g., research, inspiration, reflection, challenge).  
   - Always include one wild card for creative inspiration.

3. **Tailor to Student Style:**  
   - Adapt card content to the style:
     - **Hands-on builder**: Action-based tasks (e.g., "Build a prototype").
     - **Trend-focused creator**: Trend research (e.g., "Analyze current designs").
     - **Experienced artist**: Conceptual prompts (e.g., "Explore historical influences").
     - **Skilled coder**: Technical focus (e.g., "Research UX patterns").
     - **Overwhelmed beginner**: Simple steps (e.g., "List 3 ideas").

4. **Generate Cards:**  
   - Create exactly 2-3 cards with:
     - **type**: From the enum (question, goal, wild, idea, research, inspiration, reflection, challenge).
     - **content**: A concise, project-specific prompt.
     - **content2**: Additional detail or tip (e.g., "Search game dev forums").
     - **imagePrompt**: A descriptive image idea (e.g., "A sketch of a game loop").
   - Ensure relevance to the project and style.

5. **Explain Choices:**  
   - Provide a brief analysis of why these cards fit the project's stage and style.

### RULES:
- Generate **2-3 cards** only.
- Tailor cards to the project and style—avoid generics.
- Include a research tip for research cards.
- Keep content short and actionable.
- Do not repeat cards unless requested.

### CARD EXAMPLES:
- **Hands-On Builder (e.g., Longboard Maker, completeness < 0.5):**
  - challenge: Build a small longboard model with cardboard. What's one thing that's harder than you thought?
  - wild: What if your longboard was inspired by a surfboard?
  - research: Check out three viral TikToks in your style.
  - idea: What if your video worked without sound?
  - inspiration: A sleek surfboard on a wave

- **Trend-Focused Creator (e.g., TikTok Editor, completeness ≥ 0.5):**
  - research: Check out three viral TikToks in your style.
  - wild: What if your video worked without sound?
  - inspiration: A sleek surfboard on a wave

- **Experienced Artist (e.g., Sculptor, completeness ≥ 0.5):**
  - inspiration: Look at how Renaissance artists used metal.
  - wild: What if your sculpture moved with the wind?
  - research: Find an app with great onboarding.

- **Skilled Coder (e.g., App Developer, completeness ≥ 0.5):**
  - research: Find an app with great onboarding.
  - wild: What if your app used voice controls?
  - idea: What if your app was inspired by a game?

- **Overwhelmed Beginner (e.g., App Newbie, completeness < 0.5):**
  - question: What’s the one thing your app should do?
  - wild: What if your app was inspired by a game?
`

    const result = await model.generateContent(prompt)
    const resultData = JSON.parse(result.response.text())
    console.log(result.response.usageMetadata);

    const combinedResult = {
        ...resultData1,
        analysis2: resultData.analysis,
        card_suggestions: resultData.card_suggestions,
    }


    return new Response(JSON.stringify(combinedResult), { status: 200 });
}
