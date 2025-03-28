import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { toast } from 'react-hot-toast';
import './MemoryMatch.css';

interface Card {
  id: number;
  content: string;
  type: 'client' | 'project' | 'team';
  isFlipped: boolean;
  isMatched: boolean;
  position: number; 
}

interface MemoryMatchProps {
  difficulty?: 'easy' | 'hard';
  onGameComplete?: (score: number) => void;
}

const OFFICE_ITEMS = {
  clients: ['Acme Corp', 'TechGiant', 'GlobalFirm', 'StartupsInc'],
  projects: ['Phoenix', 'Odyssey', 'Genesis', 'Atlas'],
  teams: ['HR', 'Engineering', 'Marketing', 'Sales']
};

const MemoryMatch: React.FC<MemoryMatchProps> = ({ 
  difficulty = 'easy',
  onGameComplete 
}) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const gridSize = difficulty === 'easy' ? 16 : 36; 

  const createCards = () => {
    const newCards: Card[] = [];
    const pairs = gridSize / 2;
    let id = 0;

    for (let i = 0; i < pairs; i++) {
      const type = i % 3 === 0 ? 'client' : i % 3 === 1 ? 'project' : 'team';
      const content = OFFICE_ITEMS[`${type}s`][Math.floor(i / 3) % 4];
      
      for (let j = 0; j < 2; j++) {
        newCards.push({
          id: id++,
          content,
          type,
          isFlipped: false,
          isMatched: false,
          position: newCards.length 
        });
      }
    }

    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    return shuffledCards.map((card, index) => ({
      ...card,
      position: index
    }));
  };

  useEffect(() => {
    const initialCards = createCards();
    setCards(initialCards);
    setGameStartTime(Date.now());
    setScore(0);
    setFlippedCards([]);
    setShowConfetti(false);
    setIsProcessing(false);
  }, [difficulty]);

  const handleCardClick = (clickedPosition: number) => {
    const clickedCard = cards.find(card => card.position === clickedPosition);
    
    if (!clickedCard) return;

    if (
      isProcessing || 
      flippedCards.length === 2 || 
      clickedCard.isMatched || 
      clickedCard.isFlipped ||
      flippedCards.includes(clickedCard.id)
    ) {
      return;
    }

    const newCards = cards.map(card => 
      card.position === clickedPosition
        ? { ...card, isFlipped: true }
        : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (!firstCard || !secondCard) {
        setIsProcessing(false);
        setFlippedCards([]);
        return;
      }

      if (firstCard.content === secondCard.content) {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          setScore(prev => prev + 10);
          setIsProcessing(false);
          
          toast.success('+10 XP!', {
            position: 'top-center',
            duration: 1000
          });

          if (newCards.every(card => card.isMatched || (card.id === firstId || card.id === secondId))) {
            const timeTaken = (Date.now() - (gameStartTime || 0)) / 1000;
            const timeBonus = timeTaken <= 90 ? 50 : 0;
            setScore(prev => prev + timeBonus);
            setShowConfetti(true);
            if (timeBonus) {
              toast.success('Speed bonus: +50 XP!', {
                position: 'top-center',
                duration: 2000
              });
            }
            onGameComplete?.(score + timeBonus);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {showConfetti && <Confetti />}
      <div className="mb-4">
        <span className="text-2xl font-bold">Score: {score}</span>
      </div>
      <div 
        className={`grid gap-4 ${
          difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-6'
        }`}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`
              w-24 h-32 p-0 border-0 perspective-1000
              ${card.isMatched ? 'opacity-50' : ''}
              ${isProcessing ? 'pointer-events-none' : ''}
            `}
            onClick={() => handleCardClick(card.position)}
            disabled={isProcessing || card.isMatched}
          >
            <motion.div
              className="relative w-full h-full transform"
              animate={{ rotateY: card.isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Card Front */}
              <div
                className={`
                  absolute w-full h-full bg-white rounded-lg shadow-md
                  flex items-center justify-center text-center p-2
                  ${!card.isFlipped ? 'backface-hidden' : 'hidden'}
                `}
              >
                <span className="text-3xl">🤔</span>
              </div>
              
              {/* Card Back */}
              <div
                className={`
                  absolute w-full h-full bg-blue-100 rounded-lg shadow-md
                  flex flex-col items-center justify-center p-2 text-sm
                  ${card.isFlipped ? '' : 'hidden backface-hidden'}
                  transform rotate-y-180
                `}
              >
                <div className="text-xs text-gray-600 mb-1">
                  {card.type.charAt(0).toUpperCase() + card.type.slice(1)}:
                </div>
                <div className="font-semibold text-center">
                  {card.content}
                </div>
              </div>
            </motion.div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatch;
