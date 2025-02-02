'use client'

import { aiConfig } from "@/utils/ai-config";
import { useState } from "react";

export default function Quiz() {
    const names = aiConfig.names.store((state) => state.data);
    const quiz = aiConfig.quiz.store((state) => state.data);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!names || !quiz) return null;

    const handleAnswerSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
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

    if (quiz.length <= currentQuestionIndex || 
        !quiz[currentQuestionIndex].question &&
        !quiz[currentQuestionIndex].options &&
        !quiz[currentQuestionIndex].answer) {
        return (
            <div>
                <div>Quiz not found</div>
            </div>
        )
    }

    return (
        <div>
            <div><strong>Test your knowledge of {names[0]}</strong></div>
            <div className='space-y-6 mt-4'>
                {!showResults && (
                    <div className="bg-gray-100 p-4 text-black rounded-lg">
                        <div className='font-sans text-xl mb-4'>
                            Question {currentQuestionIndex + 1} of {quiz.length}
                        </div>
                        <div className='font-sans text-xl mb-4'>{quiz[currentQuestionIndex].question}</div>
                        <div className='space-y-2'>
                            {quiz[currentQuestionIndex].options && quiz[currentQuestionIndex].options.map((option, optionIndex) => (
                                <div
                                    key={optionIndex}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`p-2 rounded cursor-pointer ${selectedAnswers[currentQuestionIndex] === option
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-200'
                                        }`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>
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
