"use client";

import { useEffect, useState } from 'react';
import Card from './Card';

export default function Cards({ cards: newCards, onSubmit }) {
  const [cards, setCards] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const newCardsData = []
    newCards.forEach(card => {
      newCardsData.push({
        ...card,
        id: Math.random().toString(36).substring(2, 9),
      })
    })
    setCards(newCardsData);
  }, [newCards]);

  const handleCardClick = id => {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  };

  const handleSubmit = (response) => {
    onSubmit(response);
    setCards(cards.filter(card => card.id !== selectedId));
    setSelectedId(null);
  }

  const cardsInHand = selectedId ? cards.length - 1 : cards.length;
  let cardInHandIndex = 0
  return (
    <div className="">
      {cards.map((card) => {
        return (
          <div key={card.id} className="relative">
            <Card
              card={card}
              index={(selectedId !== card.id) ? cardInHandIndex++ : 0}
              cardsInHand={cardsInHand}
              selected={selectedId === card.id}
              onClick={() => handleCardClick(card.id)}
              onSubmit={handleSubmit}
            />
          </div>
        );
      })}
    </div>
  );
}
