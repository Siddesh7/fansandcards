
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  card: {
    id: number;
    text: string;
    type: 'prompt' | 'answer' | 'action';
    rarity?: string;
  };
  isSelected?: boolean;
  isSubmitted?: boolean;
  onClick?: () => void;
  className?: string;
}

const GameCard = ({ card, isSelected, isSubmitted, onClick, className }: GameCardProps) => {
  const getCardStyle = () => {
    switch (card.type) {
      case 'prompt':
        return 'bg-black border-red-400 text-white';
      case 'answer':
        return 'bg-white border-green-400 text-black';
      case 'action':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-400 text-black';
      default:
        return 'bg-white border-gray-400 text-black';
    }
  };

  const getTypeLabel = () => {
    switch (card.type) {
      case 'prompt': return 'PROMPT';
      case 'answer': return 'ANSWER';
      case 'action': return 'ACTION';
      default: return 'CARD';
    }
  };

  const getBadgeStyle = () => {
    switch (card.type) {
      case 'prompt': return 'bg-red-600 text-white';
      case 'answer': return 'bg-green-600 text-white';
      case 'action': return 'bg-black text-yellow-400';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card
      className={cn(
        getCardStyle(),
        'border-2 p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg',
        isSelected && 'border-yellow-400 scale-105 shadow-lg shadow-yellow-400/50',
        isSubmitted && 'opacity-50 cursor-not-allowed',
        card.type === 'action' && 'animate-pulse',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <Badge className={getBadgeStyle()}>
          {getTypeLabel()}
        </Badge>
        <Trophy className="w-4 h-4" />
      </div>
      
      <p className="font-semibold text-sm md:text-base min-h-[60px] flex items-center">
        {card.text}
      </p>
      
      {card.rarity && (
        <div className="mt-2 text-center">
          <Badge variant="outline" className="text-xs">
            {card.rarity}
          </Badge>
        </div>
      )}
    </Card>
  );
};

export default GameCard;
