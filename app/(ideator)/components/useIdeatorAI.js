import { experimental_useObject as useObject } from 'ai/react';
import { aiSchemas } from "@/utils/Schema";
import { create } from 'zustand';
import { useEffect } from 'react';

export const useIdeator = create((set) => ({
    questions: [],
    strategies: [],
    wordCloud: [],
    setQuestions: (questions) => set({ questions }),
    setStrategies: (strategies) => set({ strategies }),
    setWordCloud: (wordCloud) => set({ wordCloud }),
}))
export default function useIdeatorAI() {
    const ideatorData = useIdeator();
    const ai = useObject({ api: '/api/name', schema: aiSchemas.Ideator });

    useEffect(() => {
        if (ai.object) {
            ideatorData.setQuestions(ai.object.questions);
            ideatorData.setStrategies(ai.object.strategies);
        }
    }, [ai.object])

    const getAI = async (newDescription) => {
        const prompt = `
            ROLE: You are the "Project Pathfinder," an AI guide that helps students develop and refine their project ideas through targeted questioning. 
            Your goal is to analyze what students have shared so far and provide thoughtful questions and strategies that will help them clarify their project vision.

            INPUT:
            - Current project description, as defined by the user

            PROCESS:
            1. Content Analysis:
            - Identify the project's domain/subject areas and topics
            - Assess the current level of detail and clarity
            - Detect gaps in project definition (scope, goals, methodology, resources, timeline)

            2. Question Generation:
            - Create 2-5 questions based on gaps identified
            - Ensure questions build on existing content rather than repeating information
            - Focus on practical aspects that will help the student move forward

            3. Strategies:
            - Create 2-3 strategies that will help the student refine their project (e.g., research strategies, design thinking methods, opportunity analysis
            - Ensure strategies build on existing content rather than repeating information
            - Each strategy should be a specific task the student can complete
            - Tasks should be actionable and help gather information or make decisions
            - Include estimated time to complete each task
            - Tasks should build progressively (e.g. research -> analyze -> decide)
            - Tasks should help address gaps identified in content analysis

            RULES:
            - Questions should be specific to the project content provided, not generic
            - Prioritize questions that help scope definition and practical implementation
            - Frame questions positively to encourage creative problem-solving
            - Keep everything short, clear, concise, and actionable

            the proect description is: ${newDescription}`
        ai.submit({ prompt, key: 'ideator' });
    }

    return { getAI };
}