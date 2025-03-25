"use client";

import { useEffect, useState } from 'react';
import Card from './Card';
import { AnimatePresence } from 'framer-motion';

export default function Cards({ cards, onSubmit }) {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setSelectedId(null);
  }, [cards]);

  if (!cards || Array.isArray(cards) && cards.length === 0) return

  const handleCardClick = id => {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  };


  const handleSubmit = (responseObject) => {
    onSubmit(responseObject);
  }


  const cardsInHand = selectedId ? cards.length - 1 : cards.length;
  let cardInHandIndex = 0
  return (
    <div className="">

      {selectedId != null && <div className="fixed top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm z-[99] flex items-center justify-center"
        onClick={() => setSelectedId(null)} />}

      <AnimatePresence>
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={(selectedId !== index) ? cardInHandIndex++ : 0}
              cardsInHand={cardsInHand}
              selected={selectedId === index}
              onClick={() => handleCardClick(index)}
              onSubmit={handleSubmit}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
