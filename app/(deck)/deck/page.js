"use client";

import Cards from '../components/Cards'
import Initial from '../components/Initial';
import { useEffect, useState } from 'react';

export default function CardGamePage() {
  const [description, setDescription] = useState("");
  const [responses, setResponses] = useState([]);
  const [profile, setProfile] = useState({ interests: "", style: "", goals: "", completeness: 0 });
  const [cards, setCards] = useState([]);

  const addResponse = (response) => {
    setResponses([...responses, response]);
  }

  useEffect(() => {
    if (responses.length === 0) return;
    (async () => {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, responses, profile }),
      });
      const data = await response.json();
      setDescription(data.updated_description);
      setProfile(data.updated_profile);
      console.log(data.analysis);
      console.log(data.analysis2);
      setCards(data.card_suggestions);
    })();
  }, [responses]);

  if (description === "") {
    return <Initial onInitial={(newDescription) => { setDescription(newDescription); addResponse(newDescription) }} />
  }

  return (
    <div className='absolute w-full h-full flex flex-col items-center justify-center p-8 bg-gray-300'>
      <div className='fixed top-0 left-0 h-full  max-w-md'>
        <div className="flex flex-col gap-1">

          <div className='flex flex-col px-8 bg-white p-4'>
            <h2 className='underline'>Description</h2>
            <p>{description}</p>
          </div>

          <div className='flex flex-col px-8 bg-white p-4'>
            <h2 className='underline'>Profile</h2>
            {Object.entries(profile).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Cards cards={cards} onSubmit={addResponse} />
    </div >
  );
}