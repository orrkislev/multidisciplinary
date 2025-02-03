'use client'

import { aiConfig, useUserData } from "@/utils/ai-config";
import { useState } from "react";

export default function Quiz() {
    const assessment = aiConfig.literacyAssessment.store((state) => state.data);
    const { proficiency, setProficiency } = useUserData()

    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!assessment) return null;
    if (!assessment.questions) return null;

    const handleAnswerChange = (questionIndex, option) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = option;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        const calculatedProficiency = aiConfig.literacyAssessment.calculateProficiency(answers);
        setProficiency(calculatedProficiency);
        setSubmitted(true);
    };

    // Navigation handlers
    const handleNext = () => setCurrentQuestionIndex(i => Math.min(i + 1, assessment.questions.length - 1));
    const handlePrevious = () => setCurrentQuestionIndex(i => Math.max(i - 1, 0));

    if (submitted) {
        return <div className="p-4 bg-green-100 rounded">Your proficiency level is: {proficiency}</div>;
    }

    const question = assessment.questions[currentQuestionIndex];

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
            <div className="mb-4">
                <p className="font-semibold text-lg">{question.question}</p>
                <div className="mt-2">
                    {question.options && question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="mr-4">
                            <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                value={option}
                                checked={answers[currentQuestionIndex] === option}
                                onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                                className="mr-1"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex justify-between">
                {currentQuestionIndex > 0 ? (
                    <button onClick={handlePrevious} className="px-4 py-2 bg-gray-300 rounded">Previous</button>
                ) : <div /> }
                {currentQuestionIndex < assessment.questions.length - 1 ? (
                    <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
                ) : (
                    <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
                )}
            </div>
            <div className="mt-2 text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </div>
        </div>
    );
}
