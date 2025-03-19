"use client";
import { useState } from 'react';
import CardContainer from './CardContainer';
import CardImage from './CardImage';

export default function Card(props) {
    const cardData = props.card;
    const [response, setResponse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onSubmit(props.card.content + ' -> ' + response);
    }

    return (
        <CardContainer {...props} >
            <CardImage prompt={cardData.imagePrompt} selected={props.selected} />

            <p className="absolute top-0 left-0 font-mono text-xs bg-white px-2 py-1">{cardData.type}</p>
            <div style={{ fontFamily: 'var(--font-cedarville-cursive)', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {cardData.content.substring(0, 10)}...
            </div>

            {props.selected &&
                <>
                    <p className="p-2"> {cardData.content}</p>
                    <p className="p-2"> {cardData.content2}</p>

                    {/* {cardData.type === 'question' && ( */}
                    <>
                        <input type="text" className="w-full border border-gray-300 rounded-md p-2" value={response} onChange={(e) => setResponse(e.target.value)} />
                        <button className="mb-2 px-3 py-1 bg-gray-200 rounded" onClick={handleSubmit}>
                            Submit
                        </button>
                    </>
                    {/* )} */}

                    <button onClick={props.onClick} className="mb-2 px-3 py-1 bg-gray-200 rounded">
                        Close
                    </button>
                </>
            }

        </CardContainer>
    );
}
