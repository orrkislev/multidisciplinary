'use client'

import { aiConfig } from "@/utils/ai-config";
import { useState } from "react";

export default function Quiz() {
    const names = aiConfig.names.store((state) => state.data);
    const quiz = aiConfig.quiz.store((state) => state.data);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    if (!names || !quiz) return null;

    const handleAnswerSelect = (questionIndex, option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.forEach((question, index) => {
            if (selectedAnswers[index] === question.answer) {
                correct++;
            }
        });
        return correct;
    };

    return (
        <div>
            <div><strong>Test your knowledge of {names[0]}</strong></div>
            <div className='space-y-6 mt-4'>
                {quiz.map((question, questionIndex) => (
                    <div key={questionIndex} className="bg-gray-100 p-4 text-black rounded-lg">
                        <div className='font-sans text-xl mb-4'>{question.question}</div>
                        <div className='space-y-2'>
                            {question.options && question.options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    onClick={() => handleAnswerSelect(questionIndex, option)}
                                    className={`p-2 rounded cursor-pointer ${selectedAnswers[questionIndex] === option
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-200'
                                        } ${showResults
                                            ? option === question.answer
                                                ? 'bg-green-500 text-white'
                                                : selectedAnswers[questionIndex] === option
                                                    ? 'bg-red-500 text-white'
                                                    : ''
                                            : ''
                                        }`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {Object.keys(selectedAnswers).length === quiz.length && !showResults && (
                    <button
                        onClick={() => setShowResults(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Check Answers
                    </button>
                )}
                {showResults && (
                    <div className="text-xl">
                        Your score: {calculateScore()} out of {quiz.length}
                    </div>
                )}
            </div>
        </div>
    )
}
