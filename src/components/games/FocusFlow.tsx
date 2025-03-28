import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FileText, Mail, MessageCircle, Calendar } from 'lucide-react';
import Confetti from 'react-confetti';

interface FocusFlowProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onGameComplete?: (score: number) => void;
}

interface Distraction {
  id: string;
  type: 'email' | 'chat' | 'meeting';
  position: { x: number; y: number };
}

const DIFFICULTY_SETTINGS = {
  easy: {
    targetSpeed: 1,
    distractionInterval: 7000,
    duration: 30000,
    xpMultiplier: 1
  },
  medium: {
    targetSpeed: 1.2,
    distractionInterval: 5000,
    duration: 45000,
    xpMultiplier: 1.2
  },
  hard: {
    targetSpeed: 1.5,
    distractionInterval: 3000,
    duration: 60000,
    xpMultiplier: 1.5
  }
};

const FocusFlow: React.FC<FocusFlowProps> = ({
  difficulty = 'easy',
  onGameComplete
}) => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const settings = DIFFICULTY_SETTINGS[difficulty];

  // Generate smooth path for target
  const updateTargetPosition = useCallback(() => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 30; // percentage of container
    const newX = 50 + Math.cos(angle) * radius;
    const newY = 50 + Math.sin(angle) * radius;

    setTargetPosition({ x: newX, y: newY });
  }, []);

  // Handle target focus
  const handleTargetFocus = () => {
    if (gameEnded) return;
    setIsFocused(true);
  };

  const handleTargetBlur = () => {
    if (gameEnded) return;
    setIsFocused(false);
  };

  // Handle distraction click
  const handleDistractionClick = (id: string) => {
    if (gameEnded) return;
    setScore(prev => Math.max(0, prev - 5));
    setDistractions(prev => prev.filter(d => d.id !== id));
    toast.error('-5 XP', { duration: 500 });
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeRemaining(settings.duration);
    setDistractions([]);
    setShowConfetti(false);
    setIsFocused(false);
  };

  // Game timer and score accumulation
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const scoreInterval = setInterval(() => {
      if (isFocused) {
        setScore(prev => prev + settings.xpMultiplier);
      }
    }, 1000);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          setGameEnded(true);
          if (score > 0) {
            setShowConfetti(true);
          }
          onGameComplete?.(score);
          clearInterval(timer);
          clearInterval(scoreInterval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(scoreInterval);
    };
  }, [gameStarted, gameEnded, score, settings.xpMultiplier, isFocused, onGameComplete]);

  // Target movement
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const moveInterval = setInterval(updateTargetPosition, 2000 / settings.targetSpeed);
    return () => clearInterval(moveInterval);
  }, [gameStarted, gameEnded, settings.targetSpeed, updateTargetPosition]);

  // Spawn distractions
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const spawnDistraction = () => {
      const types: ('email' | 'chat' | 'meeting')[] = ['email', 'chat', 'meeting'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const position = {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      };

      const distraction: Distraction = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        position
      };

      setDistractions(prev => [...prev, distraction]);

      // Remove distraction after 3 seconds
      setTimeout(() => {
        setDistractions(prev => prev.filter(d => d.id !== distraction.id));
      }, 3000);
    };

    const spawnInterval = setInterval(spawnDistraction, settings.distractionInterval);
    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameEnded, settings.distractionInterval]);

  if (!gameStarted || gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {showConfetti && score > 0 && <Confetti />}
        <div className="text-2xl font-bold mb-4">
          {gameEnded ? `Final Score: ${score}` : 'Focus Flow'}
        </div>
        <div className="mb-4 text-gray-600">
          Stay focused on the document while avoiding distractions!
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

      {/* Target Document */}
      <motion.button
        type="button"
        animate={{ x: `${targetPosition.x}%`, y: `${targetPosition.y}%` }}
        transition={{ type: "spring", stiffness: 50, damping: 10 }}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg
          ${isFocused ? 'ring-4 ring-blue-500 bg-blue-100' : 'bg-white hover:bg-gray-50'}
          shadow-lg transition-colors`}
        onMouseEnter={handleTargetFocus}
        onMouseLeave={handleTargetBlur}
      >
        <FileText
          className={`w-8 h-8 ${isFocused ? 'text-blue-500 animate-pulse' : 'text-gray-600'}`}
        />
      </motion.button>

      {/* Distractions */}
      <AnimatePresence>
        {distractions.map(distraction => (
          <motion.button
            key={distraction.id}
            type="button"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: `${distraction.position.x}%`,
              y: `${distraction.position.y}%`
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 p-3
              bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            onClick={() => handleDistractionClick(distraction.id)}
          >
            {distraction.type === 'email' && (
              <div className="relative">
                <Mail className="w-6 h-6 text-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              </div>
            )}
            {distraction.type === 'chat' && (
              <div className="relative">
                <MessageCircle className="w-6 h-6 text-green-500" />
                <div className="w-4 h-4 bg-gray-200 rounded-full absolute -top-1 -right-1
                  animate-bounce" />
              </div>
            )}
            {distraction.type === 'meeting' && (
              <div className="relative">
                <Calendar className="w-6 h-6 text-orange-500" />
                <div className="absolute -top-2 -right-2 px-1 text-xs bg-orange-500
                  text-white rounded">NOW</div>
              </div>
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FocusFlow;
