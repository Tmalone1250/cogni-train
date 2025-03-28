import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { AlertTriangle, Bug, Zap, Shield } from 'lucide-react';
import { generateCodeSnippet, getDifficultyLevels, getLanguages } from '../../services/codeGeneration';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('go', go);

interface BugLocation {
  line: number;
  type: 'syntax' | 'logic' | 'security' | 'performance';
}

interface CodeSnippet {
  id: string;
  language: string;
  original_code: string;
  flawed_code: string;
  bug_locations: BugLocation[];
  difficulty: number;
}

interface CodeReviewRaceProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  onGameComplete?: (score: number) => void;
}

const difficultyMap = {
  easy: 1,
  medium: 3,
  hard: 5
};

const BUG_TYPES = {
  syntax: { icon: AlertTriangle, color: 'yellow', xp: 5, penalty: 2 },
  logic: { icon: Bug, color: 'red', xp: 10, penalty: 5 },
  security: { icon: Shield, color: 'purple', xp: 20, penalty: 10 },
  performance: { icon: Zap, color: 'orange', xp: 15, penalty: 7 }
};

const CodeReviewRace: React.FC<CodeReviewRaceProps> = ({
  difficulty = 'easy',
  onGameComplete
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [selectedBugType, setSelectedBugType] = useState<string>('syntax');
  const [foundBugs, setFoundBugs] = useState<BugLocation[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const settings = {
    timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45,
    bugsCount: difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  };

  const handleBugTypeChange = (type: string) => {
    setSelectedBugType(type);
  };

  const loadSnippet = useCallback(async () => {
    try {
      const level = difficultyMap[difficulty];
      const languages = getLanguages(level);
      const language = languages[Math.floor(Math.random() * languages.length)];
      
      const snippet = await generateCodeSnippet(level, language);
      setSnippet(snippet);
    } catch (error) {
      console.error('Error loading snippet:', error);
      toast.error('Failed to load code snippet');
    }
  }, [difficulty]);

  const startGame = () => {
    loadSnippet();
    setGameStarted(true);
    setGameEnded(false);
    setScore(0);
    setTimeLeft(settings.timeLimit);
    setFoundBugs([]);
    setShowHint(false);
    setShowConfetti(false);
  };

  const handleLineClick = useCallback((lineNumber: number) => {
    if (!gameStarted || gameEnded) return;

    const bug = snippet?.bug_locations.find(b => b.line === lineNumber);
    const alreadyFound = foundBugs.some(b => b.line === lineNumber);

    if (bug && !alreadyFound) {
      if (bug.type === selectedBugType) {
        const xp = BUG_TYPES[selectedBugType].xp;
        setScore(prev => prev + xp);
        setFoundBugs(prev => [...prev, bug]);
        toast.success(`+${xp} XP - ${selectedBugType} bug found!`);

        if (foundBugs.length + 1 === snippet.bug_locations.length) {
          setGameEnded(true);
          setShowConfetti(true);
          onGameComplete?.(score + xp);
        }
      } else {
        const penalty = bugAtLine 
          ? BUG_TYPES[selectedBugType].penalty 
          : Math.min(...Object.values(BUG_TYPES).map(t => t.penalty));
        setScore(prev => Math.max(0, prev - penalty));
        toast.error(`-${penalty} XP - Wrong identification!`);
      }
    } else if (alreadyFound) {
      toast.error('Bug already found!');
    } else {
      setScore(prev => Math.max(0, prev - 2));
      toast.error('No bug here!');
    }
  }, [gameStarted, gameEnded, snippet, foundBugs, selectedBugType, score, onGameComplete]);

  const requestHint = () => {
    if (!gameStarted || gameEnded) return;
    
    const unfoundBugs = snippet?.bug_locations.filter(
      bug => !foundBugs.some(found => found.line === bug.line)
    );
    
    if (unfoundBugs.length > 0) {
      setScore(prev => Math.max(0, prev - 3));
      setShowHint(true);
      toast(`Hint: Check line ${unfoundBugs[0].line}`, { 
        duration: 3000,
        icon: '💡'
      });
    }
  };

  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setGameEnded(true);
          onGameComplete?.(score);
          clearInterval(timer);
          return 0;
        }
        // Screen shake effect in last 10 seconds
        if (prev <= 10) {
          document.body.classList.add('shake');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.body.classList.remove('shake');
    };
  }, [gameStarted, gameEnded, score, onGameComplete]);

  useEffect(() => {
    if (!gameStarted || gameEnded || showHint) return;

    const struggleTimer = setTimeout(() => {
      if (foundBugs.length === 0) {
        toast('Struggling? Try using a hint!', {
          icon: '💭',
          duration: 3000
        });
      }
    }, 30000);

    return () => clearTimeout(struggleTimer);
  }, [gameStarted, gameEnded, foundBugs.length, showHint]);

  if (!gameStarted || gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {showConfetti && score > 0 && <Confetti />}
        <div className="text-2xl font-bold mb-4">
          {gameEnded ? `Final Score: ${score}` : 'Code Review Race'}
        </div>
        <div className="mb-4 text-gray-600">
          Find and classify bugs in the code before time runs out!
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold">Level: {getDifficultyLevels().find(l => l.value === difficultyMap[difficulty])?.label}</h2>
          <span className="text-gray-600">Language: {snippet?.language}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xl">Score: {score}</span>
          <span className="text-xl">Time: {timeLeft}s</span>
        </div>
      </div>

      {/* Code Display */}
      {snippet && (
        <div className="flex-1 overflow-y-auto bg-gray-900 text-gray-100 p-4 rounded-lg font-mono">
          <div className="relative">
            <SyntaxHighlighter 
              language={snippet.language} 
              style={githubGist}
              wrapLines={true}
              showLineNumbers={true}
              lineProps={(lineNumber: number) => {
                const isFound = foundBugs.some(b => b.line === lineNumber);
                const bug = snippet.bug_locations.find(b => b.line === lineNumber);
                return {
                  style: {
                    backgroundColor: isFound
                      ? `rgba(${bug?.type === 'security' ? '220,0,220,0.2' :
                          bug?.type === 'performance' ? '255,165,0,0.2' :
                          bug?.type === 'logic' ? '255,0,0,0.2' :
                          '255,255,0,0.2'})`
                      : undefined,
                    cursor: 'pointer',
                  },
                  onClick: () => handleLineClick(lineNumber),
                  className: showHint && bug && !isFound ? 'animate-pulse' : ''
                };
              }}
            >
              {snippet.flawed_code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Controls */}
      {gameStarted && !gameEnded && (
        <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
          <select
            value={selectedBugType}
            onChange={(e) => handleBugTypeChange(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300"
            aria-label="Select bug type"
          >
            {Object.keys(BUG_TYPES).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Bug
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={requestHint}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={gameEnded}
          >
            Hint (-3 XP)
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeReviewRace;
