import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Plus, Repeat } from 'lucide-react';

const CardCollection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAR, setShowAR] = useState(false);
  
  const [promptCards] = useState([
    { id: 1, text: "The worst transfer signing was ___", rarity: "Common", owned: true },
    { id: 2, text: "___ is why we got relegated", rarity: "Common", owned: true },
    { id: 3, text: "The ultimate fan chant is about ___", rarity: "Rare", owned: true },
    { id: 4, text: "___ ruined the World Cup", rarity: "Epic", owned: false },
    { id: 5, text: "VAR would never overturn ___", rarity: "Legendary", owned: false },
  ]);
  
  const [answerCards] = useState([
    { id: 1, text: "A drunk ultra with a megaphone", rarity: "Common", owned: true },
    { id: 2, text: "Neymar's diving masterclass", rarity: "Common", owned: true },
    { id: 3, text: "Messi's tax returns", rarity: "Rare", owned: true },
    { id: 4, text: "Ronaldo's hair gel budget", rarity: "Rare", owned: true },
    { id: 5, text: "Mourinho's parking instructions", rarity: "Epic", owned: true },
    { id: 6, text: "Pep's bald head conspiracy", rarity: "Epic", owned: false },
    { id: 7, text: "Cristiano's legendary rage celebration", rarity: "Legendary", owned: true },
    { id: 8, text: "Messi's World Cup tears of joy", rarity: "Legendary", owned: false },
  ]);
  
  const [actionCards] = useState([
    { id: 1, text: "Fan Frenzy: Double points this round!", rarity: "Common", owned: true },
    { id: 2, text: "Red Card: Block a player's submission", rarity: "Rare", owned: true },
    { id: 3, text: "Steal a Card: Take opponent's card", rarity: "Epic", owned: false },
    { id: 4, text: "Ultra Mode: Triple points for winner", rarity: "Legendary", owned: false },
  ]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'bg-gray-600 border-gray-400';
      case 'Rare': return 'bg-blue-600 border-blue-400';
      case 'Epic': return 'bg-purple-600 border-purple-400';
      case 'Legendary': return 'bg-yellow-600 border-yellow-400';
      default: return 'bg-gray-600 border-gray-400';
    }
  };

  const getRarityEffect = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'animate-pulse shadow-lg shadow-yellow-400/50';
      case 'Epic': return 'animate-pulse shadow-lg shadow-purple-400/30';
      case 'Rare': return 'shadow-lg shadow-blue-400/20';
      default: return '';
    }
  };

  const viewARPreview = (card) => {
    setSelectedCard(card);
    setShowAR(true);
  };

  const CardGrid = ({ cards, type, bgColor, borderColor }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          className={`${bgColor} ${borderColor} border-2 p-4 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in ${
            card.owned ? 'opacity-100' : 'opacity-40'
          } ${getRarityEffect(card.rarity)}`}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => card.owned && viewARPreview(card)}
        >
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${getRarityColor(card.rarity)} text-white`}>
              {card.rarity}
            </Badge>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-current" />
              {!card.owned && <span className="text-xs">🔒</span>}
            </div>
          </div>
          
          <p className="font-semibold text-sm mb-3 min-h-[40px] flex items-center">
            {card.text}
          </p>
          
          {card.owned && card.rarity === 'Legendary' && (
            <div className="text-center mt-2">
              <div className="text-2xl animate-bounce">✨</div>
              <p className="text-xs opacity-80 mt-1">Click for AR Preview</p>
            </div>
          )}
          
          {!card.owned && (
            <div className="text-center mt-2 opacity-60">
              <div className="text-lg">❓</div>
              <p className="text-xs">Not Owned</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-navy-900 relative">
      {/* Stadium Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027')] bg-cover bg-center opacity-10"></div>
      
      {/* Collection Showcase Lights */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎴 CARD COLLECTION 🎴
          </h1>
          <p className="text-xl text-green-400 mb-6 flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 animate-bounce" />
            Your Epic Football Card Arsenal
            <Trophy className="w-6 h-6 animate-bounce" />
          </p>
          
          {/* Collection Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
              📊 Total: {promptCards.filter(c => c.owned).length + answerCards.filter(c => c.owned).length + actionCards.filter(c => c.owned).length} Cards
            </Badge>
            <Badge className="bg-yellow-600 text-black px-4 py-2 text-lg">
              ⭐ Legendary: {[...promptCards, ...answerCards, ...actionCards].filter(c => c.owned && c.rarity === 'Legendary').length}
            </Badge>
            <Badge className="bg-purple-600 text-white px-4 py-2 text-lg">
              💎 Epic: {[...promptCards, ...answerCards, ...actionCards].filter(c => c.owned && c.rarity === 'Epic').length}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg animate-pulse">
            <Plus className="w-5 h-5 mr-2" />
            🎁 BUY CARD PACK (0.05 $CHZ)
          </Button>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-8 py-4 text-lg hover:animate-bounce">
            <Repeat className="w-5 h-5 mr-2" />
            🔄 TRADE ON KAYEN SWAP
          </Button>
        </div>

        {/* Card Categories */}
        <Tabs defaultValue="prompt" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-green-400 mb-8">
            <TabsTrigger value="prompt" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold">
              🔥 PROMPT CARDS
            </TabsTrigger>
            <TabsTrigger value="answer" className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-bold">
              💬 ANSWER CARDS
            </TabsTrigger>
            <TabsTrigger value="action" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black font-bold">
              ⚡ ACTION CARDS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Prompt Cards</h2>
              <p className="text-red-400">The hilarious setups that start the chaos!</p>
            </div>
            <CardGrid 
              cards={promptCards} 
              type="prompt" 
              bgColor="bg-black" 
              borderColor="border-red-400" 
            />
          </TabsContent>

          <TabsContent value="answer" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Answer Cards</h2>
              <p className="text-green-400">Your ammunition for comedy gold!</p>
            </div>
            <CardGrid 
              cards={answerCards} 
              type="answer" 
              bgColor="bg-white" 
              borderColor="border-green-400" 
            />
          </TabsContent>

          <TabsContent value="action" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Action Cards</h2>
              <p className="text-yellow-400">Strategic chaos creators!</p>
            </div>
            <CardGrid 
              cards={actionCards} 
              type="action" 
              bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600" 
              borderColor="border-yellow-400" 
            />
          </TabsContent>
        </Tabs>

        {/* AR Preview Modal */}
        {showAR && selectedCard && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-black to-gray-900 border-2 border-yellow-400 rounded-lg p-8 max-w-md w-full text-center animate-scale-in">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">AR Preview</h3>
                <Badge className={`${getRarityColor(selectedCard.rarity)} text-white mb-4`}>
                  {selectedCard.rarity}
                </Badge>
              </div>
              
              <div className="mb-6 p-6 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 rounded-lg">
                <div className="text-6xl mb-4 animate-bounce">
                  {selectedCard.text.includes('Cristiano') ? '🎯' : selectedCard.text.includes('Messi') ? '🐐' : '⚽'}
                </div>
                <p className="text-white font-bold mb-2">{selectedCard.text}</p>
                <div className="text-sm text-yellow-400">
                  ✨ AR Effect: {selectedCard.text.includes('Cristiano') ? 'Victory Celebration Dance' : 
                    selectedCard.text.includes('Messi') ? 'GOAT Crown Animation' : 'Spinning Football'}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
                  📱 ACTIVATE AR MODE
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black"
                  onClick={() => setShowAR(false)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in animation-delay-2000">
          <p className="text-white/70 text-lg mb-2">
            🎨 Collect, trade, and dominate with style! 🎨
          </p>
          <p className="text-green-400 text-sm">
            New cards drop weekly • Rare cards have AR effects • Trade anytime on Kayen Swap
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCollection;
