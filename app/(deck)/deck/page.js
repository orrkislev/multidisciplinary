"use client";

import Cards from '../components/Cards'
import Initial from '../components/Initial';
import { useEffect, useState } from 'react';
import { experimental_useObject as useObject } from 'ai/react';
import { descriptionSchema, cardSchema } from '../utils/schema';

export default function CardGamePage() {
  const [responses, setResponses] = useState([]);
  const [research, setResearch] = useState([]);

  const cards = useObject({ api: '/api/deck/cards', schema: cardSchema, 
  });

  const description = useObject({
    api: '/api/deck/description',
    schema: descriptionSchema,
    onFinish: ({object, error}) => {
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
    if (responses.length === 0) return;
    description.submit({ description: description.object?.description, responses, profile: description.object?.profile })
  }, [responses]);




  
  if (!responses.length) {
    return <Initial onInitial={(newDescription) => { addResponse({ content: newDescription, type: 'idea' }) }} />
  }

  return (
    <div className='absolute w-full h-full flex flex-col items-center justify-center p-8 bg-[#0e5a2a]'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), radial-gradient(circle at center, #157a3e 0%, #0e5a2a 100%)`
      }}>

      <div className='fixed top-0 left-0 h-full  max-w-md'>
        <div className="flex flex-col gap-1 p-2">

          <div className='flex flex-col px-8 bg-white p-4 bg-opacity-50 rounded-lg'>
            <h2 className='underline'>Description</h2>
            <p>{description.object?.description || ''}</p>
          </div>

        </div>
      </div>

      <div className='fixed top-0 right-0 h-full max-w-md p-2'>
        <div className="flex flex-col gap-1">
          <div className='flex flex-col px-8 bg-white p-4 bg-opacity-50 rounded-lg'>
            <h2 className='underline'>Research</h2>
            {research.map((r, index) => (
              <p key={index}>{r}</p>
            ))}
          </div>
        </div>
      </div>

      <Cards cards={cards.object?.card_suggestions} onSubmit={addResponse} />
    </div >
  );
}