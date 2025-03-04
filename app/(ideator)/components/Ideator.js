'use client'

import { useEffect, useRef, useState } from "react";
import createElement from "./Parts";
import { XIcon } from "lucide-react";
import { create } from "zustand";
import { aiSchemas } from "@/utils/Schema";
import { experimental_useObject as useObject } from 'ai/react';


export const useContent = create((set) => ({
    content: [],
    setContent: (content) => set({ content }),
    addContent: (element) => set((state) => ({ content: [...state.content, element] })),
    removeContent: (id) => set((state) => ({ content: state.content.filter(item => item.id !== id) })),
    updateContent: (id, newData) => set((state) => ({
        content: state.content.map(item => item.id === id ? { ...item, content: { ...item.content, ...newData } } : item)
    })),
    description: '',
    setDescription: (description) => set({ description }),
    strategies: [],
    setStrategies: (strategies) => set({ strategies }),
}));

export default function Ideator() {
    const [selected, setSelected] = useState(null);
    const content = useContent(state => state.content);
    const addContent = useContent(state => state.addContent);
    const removeContent = useContent(state => state.removeContent);

    const createNewText = (e) => {
        addContent(createElement('open', e.clientX, e.clientY));
    };

    const handleElementClick = (id) => {
        setSelected(id);
    };
    const removeElement = (id) => {
        removeContent(id);
        setSelected(null);
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500 to-blue-300 p-4"
            onDoubleClick={createNewText} onClick={() => setSelected(null)}>
            {content.map((item) => (
                <DraggableElement
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    selected={selected === item.id}
                    click={() => handleElementClick(item.id)}
                    remove={() => removeElement(item.id)}
                >
                    <item.element id={item.id} />
                </DraggableElement>
            ))}

            <AIButton />
            <TheDescription />
            <Strategies />
        </div>
    )
}

function DraggableElement({ x, y, selected, click, remove, children }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x, y })

    const offset = useRef({ x: 0, y: 0 });
    const handleMouseDown = (e) => {
        setIsDragging(true);
        click();
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className={`absolute bg-white p-2 pt-4 rounded-md shadow-md user-select-none ${selected ? 'border-2 border-blue-500' : ''} ${isDragging ? 'z-10' : ''}`}
            style={{ left: position.x, top: position.y }}
            onMouseDown={handleMouseDown}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}>

            <XIcon className="absolute top-0 right-0 m-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
                onClick={remove} size={16} />
            {children}
        </div>
    );
}


function AIButton() {
    const content = useContent(state => state.content);
    const addContent = useContent(state => state.addContent);
    const setDescription = useContent(state => state.setDescription);
    const setStrategies = useContent(state => state.setStrategies);

    const ai = useObject({
        api: '/api/name',
        schema: aiSchemas.canvas,
        onFinish: ({ object, error }) => {
            if (error) return console.error(error);
            setDescription(object.projectDescription);
            setStrategies(object.strategies);
            object.questions.forEach(question => {
                const x = Math.random() * window.innerWidth * .8;
                const y = Math.random() * window.innerHeight * .8;
                addContent(createElement(question.type, x, y, { question: question.question, answer: question.jsonContent }));
            })
        }
    });

    const handleAI = () => {
        const data = content.map(item => item.content.question + ' -> ' + item.content.answer).join(' ; ');

        const prompt = `
            ROLE: You are the "Project Pathfinder," an AI guide that helps students develop and refine their project ideas through targeted questioning. Your goal is to analyze what students have shared so far and provide thoughtful questions that will help them clarify their project vision.

            INPUT:
            - Current user content (array of title-content pairs representing what the student has entered so far)

            PROCESS:
            1. Content Analysis:
            - Identify the project's domain/subject area
            - Assess the current level of detail and clarity
            - Detect gaps in project definition (scope, goals, methodology, resources, timeline)

            2. Question Generation:
            - Create 2-5 questions based on gaps identified
            - Mix question types (open-ended, multiple-choice, yes/no)
            - Ensure questions build on existing content rather than repeating information
            - Focus on practical aspects that will help the student move forward

            3. Response Formatting:
            - Structure each question to prompt specific, actionable thinking
            - Questions can be of either type: open-ended, multiple-choice, or yes/no
            - For open-ended questions, include helpful context/guidance
            - For multiple-choice questions, provide meaningful options that expand thinking
            - For yes/no questions, frame them to clarify critical decision points

            4. Additional Response:
            - Provide a summary of the current project idea from the user
            - Offer a strategic approach to help the student refine their project (e.g., research strategies, design thinking methods, opportunity analysis)

            RULES:
            - Questions should be specific to the project content provided, not generic
            - Prioritize questions that help scope definition and practical implementation
            - Frame questions positively to encourage creative problem-solving
            - Include at least one question about resources/feasibility
            - Include at least one question about project goals/success criteria
            - Keep everything short, clear, concise, and actionable

                OUTPUT: {
                "questions": [
                    {
                    "type": "open",
                    "question": "string",
                    "content": {
                        "text": "string" // Guidance text to help answer
                    }
                    },
                    {
                    "type": "multiple",
                    "question": "string",
                    "content": ["option1", "option2", "option3"] // 3-5 meaningful options
                    },
                    {
                    "type": "yesno",
                    "question": "string"
                    }
                ]
                "projectDescription": "string" // A summary of the current project idea from the user
                "strategies": [
                    {
                    "title": "string",
                    "text": "string" // Guidance on how to approach the project
                    }
                ]

                }

                the user content is: ${data}
                `
        ai.submit({ prompt, key: 'canvas' });
    }

    return (
        <div className={`fixed top-8 left-[50%] transform -translate-x-1/2 -translate-y-1/2 bg-blue-200 p-2 px-8 rounded cursor-pointer
                         hover:bg-white hover:shadow-lg transition-all`}
            onClick={handleAI}>
            <span>AI</span>
        </div>
    )
}

function TheDescription() {
    const description = useContent(state => state.description);
    return (
        <div className="fixed top-8 right-8 bg-white p-2 px-4 rounded shadow-md w-64">
            <p>{description}</p>
        </div>
    )
}

function Strategies() {
    const strategies = useContent(state => state.strategies);

    return (
        <div className="fixed bottom-2 right-2 left-2 bg-white p-2 px-4 rounded shadow-md flex gap-8 justify-between">
            {strategies.map(strategy => (
                <div key={strategy.title} className="flex-1 flex flex-col">
                    <h3 className="font-bold">{strategy.title}</h3>
                    <p>{strategy.text}</p>
                </div>
            ))}
        </div>
    )
}