import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';

interface Target {
  id: string;
  type: 'target' | 'distractor';
  content: string;
  position: { x: number; y: number };
  timestamp: number;
}

interface QuickReactProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onGameComplete?: (score: number) => void;
}

const OFFICE_CONTENT = {
  targets: [
    'Priority: Q2 Report',
    'Action: Sign Contract',
    'Alert: Server Down',
    'Urgent: Client Meeting',
    'Critical: System Update',
    'Priority: Budget Review'
  ],
  distractors: [
    'Social: Cat Meme',
    'FYI: Newsletter',
    'Reminder: Birthday Lunch',
    'Social: Office Party',
    'FYI: Coffee Break',
    'Chat: Weekend Plans'
  ]
};

const DIFFICULTY_SETTINGS = {
  easy: { targetInterval: 1000, distractorRatio: 0.3, duration: 30000 },
  medium: { targetInterval: 500, distractorRatio: 0.5, duration: 45000 },
  hard: { targetInterval: 250, distractorRatio: 0.7, duration: 60000 }
};

const QuickReact: React.FC<QuickReactProps> = ({
  difficulty = 'easy',
  onGameComplete
}) => {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<Target[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  const getRandomPosition = useCallback(() => ({
    x: Math.random() * (window.innerWidth * 0.8 - 200),
    y: Math.random() * (window.innerHeight * 0.8 - 100)
  }), []);

  const createItem = useCallback((isTarget: boolean): Target => {
    const type = isTarget ? 'target' : 'distractor';
    const content = isTarget
      ? OFFICE_CONTENT.targets[Math.floor(Math.random() * OFFICE_CONTENT.targets.length)]
      : OFFICE_CONTENT.distractors[Math.floor(Math.random() * OFFICE_CONTENT.distractors.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content,
      position: getRandomPosition(),
      timestamp: Date.now()
    };
  }, [getRandomPosition]);

  const handleItemClick = (item: Target) => {
    if (gameEnded) return;

    setItems(prev => prev.filter(i => i.id !== item.id));

    if (item.type === 'target') {
      setScore(prev => prev + 5);
      toast.success('+5 XP', { duration: 500 });
    } else {
      setScore(prev => prev - 3);
      toast.error('-3 XP', { duration: 500 });
    }
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeRemaining(settings.duration);
    setItems([]);
    setShowConfetti(false);
  };

  // Game timer
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setGameEnded(true);
          if (score > 0) {
            setShowConfetti(true);
          }
          onGameComplete?.(score);
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded, score, onGameComplete]);

  // Spawn items
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const spawnItem = () => {
      const isTarget = Math.random() > settings.distractorRatio;
      setItems(prev => [...prev, createItem(isTarget)]);
    };

    const spawnInterval = setInterval(spawnItem, settings.targetInterval);
    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameEnded, settings.targetInterval, settings.distractorRatio, createItem]);

  // Remove old items
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setItems(prev => prev.filter(item => now - item.timestamp < 2000));
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, [gameStarted, gameEnded]);

  if (!gameStarted || gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {showConfetti && score > 0 && <Confetti />}
        <div className="text-2xl font-bold mb-4">
          {gameEnded ? `Final Score: ${score}` : 'Quick React'}
        </div>
        <div className="mb-4 text-gray-600">
          Click important items, ignore distractions!
        </div>
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {gameEnded ? 'Play Again' : 'Start Game'}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="text-xl font-bold">Score: {score}</div>
        <div className="text-xl">
          Time: {Math.ceil(timeRemaining / 1000)}s
        </div>
      </div>

      <AnimatePresence>
        {items.map(item => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute px-4 py-2 rounded-lg shadow-md
              ${item.type === 'target' 
                ? 'bg-blue-100 hover:bg-blue-200 border-2 border-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'}
            `}
            style={{
              left: item.position.x,
              top: item.position.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleItemClick(item)}
          >
            <span className={item.type === 'target' ? 'font-bold' : 'text-gray-600'}>
              {item.content}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuickReact;
