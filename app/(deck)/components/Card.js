"use client";
import { useState } from 'react';
import CardContainer from './CardContainer';
import CardImage from './CardImage';

export default function Card(props) {
    const cardData = props.card;
    cardData.content = cardData.content || ''
    cardData.content2 = cardData.content2 || ''
    cardData.imagePrompt = cardData.imagePrompt || ''
    cardData.type = cardData.type || ''

    const [response, setResponse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onSubmit({ type: cardData.type, content: cardData.content + ' -> ' + response });
    }

    return (
        <CardContainer {...props} >
            <CardImage prompt={cardData.imagePrompt} selected={props.selected} />

            <p className="absolute top-0 left-0 font-mono text-xs bg-white px-2 py-1">{cardData.type}</p>

            {!props.selected && (
                <div style={{ fontFamily: 'var(--font-cedarville-cursive)', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {cardData.content.substring(0, 10)}...
                </div>
            )}

            {props.selected &&
                <>
                    <div className="p-2">
                        <div className="text-sm italic">{cardData.type}</div>
                        <p className="bold"> {cardData.content}</p>
                        <p className=""> {cardData.content2}</p>
                    </div>

                    <div>
                        {['question', 'goal', 'idea', 'wild'].includes(cardData.type) && (
                            <div>
                                <textarea rows={3} placeholder="Write your answer here..." className="w-full border border-gray-300 rounded-md p-2" value={response} onChange={(e) => setResponse(e.target.value)} />
                                <button className="mb-2 px-3 py-1 bg-gray-200 rounded" onClick={handleSubmit}>
                                    Add to project
                                </button>
                            </div>
                        )}

                        {['challenge', 'research', 'inspiration'].includes(cardData.type) && (
                            <button className="mb-2 px-3 py-1 bg-gray-200 rounded" onClick={handleSubmit}>
                                Accept
                            </button>
                        )}
                    </div>
                </>
            }

        </CardContainer >
    );
}
