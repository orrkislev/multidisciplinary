'use client'

import { useState } from "react"
import { generateInterventions } from "../actions/ai actions"
import { initialWords } from "../actions/initial"
import Insertion from "./Insertion"
import Question from "./Question"
import Replacement from "./Replacement"
import AIButton, { ClearButton } from "./AIButton"
import Loading from "./Loading"

export default function Define() {
    const [words, setWords] = useState(initialWords)
    const [caret, setCaret] = useState({ word: 0, char: 0 })
    const [isLoading, setIsLoading] = useState(false)

    const getInterventionsForWord = (wordIndex) => {
        return words[wordIndex]?.interventions.filter(int =>
            int.type === 'question' || int.type === 'replacement'
        ) || []
    }
    const getInsertionAfterWord = (wordIndex) => {
        return words[wordIndex]?.interventions.find(int => int.type === 'insertion')
    }
    const handleReplacement = (wordIndex, intervention, replacement) => {
        setWords(prev => {
            const newWords = [...prev]
            const newInterventions = newWords[wordIndex].interventions
            const replacementIntervention = intervention
            replacementIntervention.options =  replacementIntervention.options.filter(opt => opt !== replacement)
            replacementIntervention.options.push(prev[wordIndex].text)
            newWords[wordIndex] = {
                ...newWords[wordIndex],
                text: replacement,
                interventions: newInterventions
            }
            return newWords
        })
    }
    const handleInsertion = (wordIndex, intervention, insertion) => {
        setWords(prev => {
            const newWords = [...prev]
            const insertedWords = insertion.split(' ').map(text => ({ text, interventions: [] }))
            newWords.splice(wordIndex + 1, 0, ...insertedWords)
            return newWords
        })
    }

    const onKeyDown = (e) => {
        if (e.key == 'ArrowLeft') setCaret(prev => {
            if (prev.char == 0) {
                if (prev.word == 0) return { word: prev.word, char: e.altKey ? 0 : prev.char - 1 }
                return { word: Math.max(0, prev.word - 1), char: e.altKey ? 0 : words[Math.max(0, prev.word - 1)].text.length }
            }
            return { word: prev.word, char: e.altKey ? 0 : prev.char - 1 }
        })
        else if (e.key == 'ArrowRight') setCaret(prev => {
            if (prev.char == words[prev.word].text.length) {
                if (prev.word == words.length - 1) return { word: prev.word, char: e.altKey ? words[prev.word].text.length : prev.char + 1 }
                return { word: prev.word + 1, char: e.altKey ? words[prev.word + 1].text.length : 0 }
            }
            return { word: prev.word, char: e.altKey ? words[prev.word].text.length : prev.char + 1 }
        })
        else if (e.key == 'Backspace') {
            setWords(prev => {
                if (caret.char == 0 && caret.word == 0) return prev
                const newWords = [...prev]
                // if we are at the start of the word, merge it with the previous word
                if (caret.char == 0) {
                    const prevWordLength = newWords[caret.word - 1].text.length
                    newWords[caret.word - 1].text = newWords[caret.word - 1].text + newWords[caret.word].text
                    newWords.splice(caret.word, 1)
                    setCaret({ word: Math.max(0, caret.word - 1), char: prevWordLength })
                    if (newWords.length == 0) newWords.push({ text: '', interventions: [] })
                    return newWords
                }
                // otherwise, delete the character
                newWords[caret.word] = {
                    ...newWords[caret.word],
                    text: newWords[caret.word].text.slice(0, caret.char - 1) + newWords[caret.word].text.slice(caret.char)
                }
                setCaret({ word: caret.word, char: Math.max(0, caret.char - 1) })
                return newWords
            })
        }
        else if (e.key == ' ') {
            setWords(prev => {
                const newWords = [...prev]
                // if we are at the end of the word, create a new empty word after
                if (caret.char == words[caret.word].text.length) {
                    newWords.splice(caret.word + 1, 0, { text: '', interventions: [] })
                    setCaret({ word: caret.word + 1, char: 0 })
                    return newWords
                }
                // if we are at the start of the word, create an empty word before
                if (caret.char == 0) {
                    newWords.splice(caret.word, 0, { text: '', interventions: [] })
                    setCaret({ word: caret.word + 1, char: 0 })
                    return newWords
                }
                // otherwise, create a new word by splicing the current word into two
                const currentWord = newWords[caret.word]
                const newWord = { text: currentWord.text.slice(caret.char), interventions: [] }
                newWords[caret.word] = { ...currentWord, text: currentWord.text.slice(0, caret.char) }
                newWords.splice(caret.word + 1, 0, newWord)
                setCaret({ word: caret.word + 1, char: 0 })
                return newWords
            })
        }
        else if (e.key.length == 1) {
            setWords(prev => {
                const newWords = [...prev]
                newWords[caret.word] = {
                    ...newWords[caret.word],
                    text: newWords[caret.word].text.slice(0, caret.char) + e.key + newWords[caret.word].text.slice(caret.char)
                }
                setCaret({ word: Math.max(0, caret.word), char: Math.max(0, caret.char + 1) })
                return newWords
            })
        }
    }

    const clickAI = async () => {
        // clear all interventions
        setIsLoading(true)
        setWords(prev => prev.map(word => ({ ...word, interventions: [] })))

        const wordTexts = words.map(w => w.text)
        const newInterventions = await generateInterventions(wordTexts)

        // Attach interventions to the appropriate words
        setWords(prev => {
            const newWords = prev.map(word => ({ ...word, interventions: [] }))

            newInterventions.forEach(intervention => {
                if (intervention.type === 'insertion') {
                    // Insertion interventions attach to the word at the position
                    if (newWords[intervention.position]) {
                        newWords[intervention.position].interventions.push(intervention)
                    }
                } else if (intervention.type === 'question' || intervention.type === 'replacement') {
                    // Question and replacement interventions attach to the first word in the range
                    if (newWords[intervention.wordStart]) {
                        newWords[intervention.wordStart].interventions.push(intervention)
                    }
                }
            })

            return newWords
        })
        setIsLoading(false)
    }

    const handleClear = () => {
        setWords([{ text: '', interventions: [] }])
        setCaret({ word: 0, char: 0 })
    }

    const getWordStyles = (wordIndex) => {
        const ints = getInterventionsForWord(wordIndex)
        let className = 'p-1 rounded relative'

        for (const int of ints) {
            if (int.type === 'question') {
                className += ' bg-yellow-200 border-b-2 border-yellow-500 cursor-help'
            } else if (int.type === 'replacement') {
                className += ' bg-pink-200 cursor-pointer border-b-2 border-pink-400'
            }
        }

        return className
    }

    return (
        <div className='w-screen h-screen flex items-center flex-col gap-4 justify-center bg-neutral-400'>
            <Loading isLoading={isLoading} />
            <div className='p-6 bg-white text-3xl flex flex-wrap focus:outline-none'
                tabIndex={0}
                onKeyDown={onKeyDown}
            >
                {words.map((word, wordIndex) => {
                    const wordInterventions = getInterventionsForWord(wordIndex)
                    const insertion = getInsertionAfterWord(wordIndex)

                    return (
                        <div key={wordIndex} className='flex items-center'>
                            <div
                                className={getWordStyles(wordIndex)}
                            >
                                {word.text.split('').map((ch, chIndex) => {
                                    return (
                                        <span key={chIndex} onClick={() => setCaret({ word: wordIndex, char: chIndex })}>
                                            {wordIndex == caret.word && chIndex == caret.char && <span className='caret'>|</span>}
                                            {ch}
                                            {chIndex == word.text.length - 1 && wordIndex == caret.word && chIndex + 1 == caret.char && <span className='caret'>|</span>}
                                        </span>
                                    )
                                })}
                                {word.text.length == 0 && caret.word == wordIndex && <span className='caret'>|</span>}


                                {wordInterventions.length > 0 && (
                                    <>
                                        {wordInterventions.map((int, i) => {
                                            if (int.type === 'question') {
                                                return <Question intervention={int} key={i} />
                                            }
                                            if (int.type === 'replacement') {
                                                return <Replacement intervention={int} key={i} onOptionClick={(opt) => handleReplacement(wordIndex, int, opt)} />
                                            }
                                        })}
                                    </>
                                )}
                            </div>

                            {insertion && (
                                <Insertion intervention={insertion} onClick={(opt) => handleInsertion(wordIndex, insertion, opt)} />
                            )}
                        </div>
                    )
                })}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 z-100">
                <ClearButton onClick={handleClear} />
                <AIButton onClick={clickAI} isLoading={isLoading} />
            </div>
        </div>
    )
}