"use client";

import Initial from '../components/Initial';
import { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { descriptionSchema, cardSchema } from '../utils/schema';
import Card from './Card';

export default function DeckPage() {
  const [responses, setResponses] = useState([]);
  const [research, setResearch] = useState([]);

  const cards = useObject({
    api: '/api/deck/cards', schema: cardSchema,
  });

  const description = useObject({
    api: '/api/deck/description',
    schema: descriptionSchema,
    onFinish: ({ object, error }) => {
      cards.submit({ description: object.description, profile: object.profile })
    }
  });


  const addResponse = (responseObject) => {
    if (['question', 'goal', 'idea', 'wild'].includes(responseObject.type)) {
      setResponses([...responses, responseObject.content]);
    } else {
      setResearch([...research, responseObject.content]);
    }
  }

  useEffect(() => {
    if (responses.length === 0 && research.length === 0) return;
    description.submit({ description: description.object?.description, responses, profile: description.object?.profile, research })
  }, [responses, research]);





  return (
    <div className='flex w-screen h-screen flex bg-gray-300'>
      {!responses.length ? (
        <Initial onInitial={(newDescription) => { addResponse({ content: newDescription, type: 'idea' }) }} />
      ) : (
        <>
          <div className='flex-1'>
            <div className="flex gap-8 justify-center items-center h-full p-8">
              {cards.object && cards.object?.card_suggestions && cards.object?.card_suggestions.map((card, index) => (
                <Card key={index} card={card} onSubmit={addResponse} />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-8 w-[25%] bg-gray-200 border-l border-gray-400 p-4'>
            <div>
              <h2 className='underline'>Description</h2>
              <div className='text-sm'>{description.object?.description || ''}</div>
            </div>

            <div>
              <h2 className='underline'>Research</h2>
              {research.map((r, index) => (
                <div key={index} className='text-sm'>{r}</div>
              ))}
            </div>

            <div>
              <h2 className='underline'>Profile</h2>
              <div className='text-sm'>interests: {description.object?.profile?.interests || ''}</div>
              <div className='text-sm'>style: {description.object?.profile?.style || ''}</div>
              <div className='text-sm'>goals: {description.object?.profile?.goals || ''}</div>
            </div>


            <div>
              <h2 className='underline'>Analysis</h2>
              <div className='text-sm'>{description.object?.analysis || ''}</div>
            </div>
          </div>
        </>
      )}

    </div >
  );
}