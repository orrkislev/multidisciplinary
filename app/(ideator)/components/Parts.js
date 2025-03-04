import { useEffect, useRef, useState } from "react"
import { useContent } from "./Ideator"

function TextElement({ id }) {
    const contentItem = useContent(state => state.content.find(item => item.id === id))
    const updateContent = useContent(state => state.updateContent)

    const handleInputChange = (e) => {
        updateContent(id, { text: e.target.value })
    }

    const txt = contentItem.content.text
    return (
        <input className="text-center" type="text" value={txt} onChange={handleInputChange}
            style={{
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
            }}
        />
    )
}

function QuestionElement({ id }) {
    const contentItem = useContent(state => state.content.find(item => item.id === id))
    const updateContent = useContent(state => state.updateContent)
    const questionRef = useRef(null)
    const answerRef = useRef(null)

    const handleChangeQuestion = (e) => {
        updateContent(id, { question: e.target.value })
    }
    const handleChangeAnswer = (e) => {
        updateContent(id, { answer: e.target.value })
    }

    const adjustHeight = (textareaRef) => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
      };

    useEffect(()=>{
        adjustHeight(questionRef)
        adjustHeight(answerRef)
    },[contentItem])

    return (
        <div className="flex flex-col">
            <textarea className="text-center border-none font-bold" value={contentItem.content.question} onChange={handleChangeQuestion}
                rows="1"
                ref={questionRef}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                }}
            />
            <textarea className="text-center text-sm" value={contentItem.content.answer} onChange={handleChangeAnswer}
                rows="1"
                ref={answerRef}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                }}
            />
        </div>
    )
}

function MultipleAnswerElement({ id }) {
    const contentItem = useContent(state => state.content.find(item => item.id === id))
    const updateContent = useContent(state => state.updateContent)
    const questionRef = useRef(null)
    const answerRef = useRef(null)

    const handleChangeQuestion = (e) => {
        updateContent(id, { question: e.target.value })
    }

    const adjustHeight = (textareaRef) => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
      };

    useEffect(()=>{
        adjustHeight(questionRef)
        adjustHeight(answerRef)
    },[contentItem])

    console.log(contentItem.content.answer)
    const options = JSON.parse(contentItem.content.answer)

    return (
        <div className="flex flex-col">
            <textarea className="text-center border-none font-bold" value={contentItem.content.question} onChange={handleChangeQuestion}
                rows="1"
                ref={questionRef}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                }}
            />
            {options.map((option, index) => (
                <button key={index} onClick={()=>updateContent(id, { answer: JSON.stringify([option]) })}>{option}</button>
            ))}
        </div>
    )
}

function YesNoElement({ id }) {
    const contentItem = useContent(state => state.content.find(item => item.id === id))
    const updateContent = useContent(state => state.updateContent)
    const questionRef = useRef(null)
    const answerRef = useRef(null)

    const handleChangeQuestion = (e) => {
        updateContent(id, { question: e.target.value })
    }

    const adjustHeight = (textareaRef) => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
      };

    useEffect(()=>{
        adjustHeight(questionRef)
        adjustHeight(answerRef)
    },[contentItem])

    return (
        <div className="flex flex-col">
            <textarea className="text-center border-none font-bold" value={contentItem.content.question} onChange={handleChangeQuestion}
                rows="1"
                ref={questionRef}
                style={{
                    resize: 'none',
                    overflow: 'hidden',
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                }}
            />
            <button onClick={()=>updateContent(id, { answer: 'Yes' })}>Yes</button>
            <button onClick={()=>updateContent(id, { answer: 'No' })}>No</button>
        </div>
    )
}

const partMap = {
    'text': {
        element: TextElement,
        default: { text: 'Hey' },
    },
    'open': {
        element: QuestionElement,
        default: { question: 'I want to', answer: 'do something' }
    },
    'multiple': {
        element: MultipleAnswerElement,
        default: { question: 'Question', answer: 'Answer' }
    },
    'yesno': {
        element: YesNoElement,
        default: { question: 'Question', answer: 'Answer' }
    }
}

export default function createElement(type, x, y, content) {
    const part = partMap[type];
    if (part) {
        return {
            type, x, y, content: { ...part.default, ...content }, id: Math.random().toString(36).substr(2, 9),  
            element: part.element        
        };
    }
    return null;
}