import { QuestionCard, AnswerCard, ActionCard } from "../types/game";

export const questionCards: QuestionCard[] = [
  // Football/Soccer themed
  {
    id: "q1",
    text: "The real reason Messi left Barcelona was ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q2",
    text: "What Ronaldo does in his spare time: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q3",
    text: "The secret to winning the World Cup: ___ and ___.",
    blanks: 2,
    category: "football",
  },
  {
    id: "q4",
    text: "What really happens in the VAR room: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q5",
    text: "Mourinho's next excuse will be: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q6",
    text: "How to make Neymar stop diving: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q7",
    text: "Pep Guardiola's tactics meeting consists of ___ and ___.",
    blanks: 2,
    category: "football",
  },
  {
    id: "q8",
    text: "The most painful thing for an Arsenal fan: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q9",
    text: "What Harry Kane dreams about every night: ___.",
    blanks: 1,
    category: "football",
  },
  {
    id: "q10",
    text: "The referee's biggest fear during a match: ___.",
    blanks: 1,
    category: "football",
  },

  // General sports
  {
    id: "q11",
    text: "The real reason athletes celebrate goals: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q12",
    text: "What coaches really say during halftime: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q13",
    text: "The worst thing about being a sports commentator: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q14",
    text: "How to become a professional athlete: ___ and ___.",
    blanks: 2,
    category: "sports",
  },
  {
    id: "q15",
    text: "What fans really think during penalty shootouts: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q16",
    text: "The secret ingredient in sports drinks: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q17",
    text: "Why athletes retire early: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q18",
    text: "The most embarrassing moment in sports history: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q19",
    text: "What really motivates professional athletes: ___.",
    blanks: 1,
    category: "sports",
  },
  {
    id: "q20",
    text: "The ultimate sports superstition: ___ before every game.",
    blanks: 1,
    category: "sports",
  },
];

export const answerCards: AnswerCard[] = [
  // Football legends and personalities
  {
    id: "a1",
    text: "Messi's tax advisor",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a2",
    text: "Ronaldo's skincare routine",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a3",
    text: "Neymar's acting classes",
    category: "football",
    rarity: "common",
  },
  { id: "a4", text: "A drunk referee", category: "football", rarity: "common" },
  {
    id: "a5",
    text: "Pep's bald head tactics",
    category: "football",
    rarity: "rare",
  },

  // Football situations
  {
    id: "a6",
    text: "VAR officials watching Netflix",
    category: "football",
    rarity: "common",
  },
  {
    id: "a7",
    text: "Mourinho parking the bus literally",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a8",
    text: "Arsenal's trophy cabinet collecting dust",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a9",
    text: "Liverpool fans singing You'll Never Walk Alone in the shower",
    category: "football",
    rarity: "common",
  },
  {
    id: "a10",
    text: "Chelsea's revolving door of managers",
    category: "football",
    rarity: "rare",
  },

  // Player behaviors
  {
    id: "a11",
    text: "Zlatan's ego having its own agent",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a12",
    text: "Mbappe's turtle celebration",
    category: "football",
    rarity: "common",
  },
  {
    id: "a13",
    text: "Haaland's robot celebration malfunction",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a14",
    text: "Klopp's teeth whitening routine",
    category: "football",
    rarity: "common",
  },
  {
    id: "a15",
    text: "Benzema's Ballon d'Or acceptance speech",
    category: "football",
    rarity: "rare",
  },

  // General football madness
  {
    id: "a16",
    text: "A penalty that actually makes sense",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a17",
    text: "Manchester United's defense",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a18",
    text: "Barcelona's financial advisor",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a19",
    text: "PSG's Champions League curse",
    category: "football",
    rarity: "common",
  },
  {
    id: "a20",
    text: "Real Madrid's transfer budget",
    category: "football",
    rarity: "rare",
  },

  // Sports general
  {
    id: "a21",
    text: "Performance-enhancing energy drinks",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a22",
    text: "A coach having an existential crisis",
    category: "sports",
    rarity: "rare",
  },
  {
    id: "a23",
    text: "Fans throwing objects at players",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a24",
    text: "Commentators running out of things to say",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a25",
    text: "Athletes thanking God for their salary",
    category: "sports",
    rarity: "rare",
  },

  // Absurd sports situations
  {
    id: "a26",
    text: "Referees using Google Translate for decisions",
    category: "sports",
    rarity: "rare",
  },
  {
    id: "a27",
    text: "Stadium hot dogs that cost more than tickets",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a28",
    text: "Sports commentators' secret drinking game",
    category: "sports",
    rarity: "legendary",
  },
  {
    id: "a29",
    text: "Athletes pretending to understand economics",
    category: "sports",
    rarity: "rare",
  },
  {
    id: "a30",
    text: "Mascots having midlife crises",
    category: "sports",
    rarity: "common",
  },

  // More football chaos
  {
    id: "a31",
    text: "Messi's growth hormone supplier",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a32",
    text: "Ronaldo's Manchester United reunion tears",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a33",
    text: "Kante's pocket containing the entire opposition",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a34",
    text: "VAR taking longer than a Netflix episode",
    category: "football",
    rarity: "common",
  },
  {
    id: "a35",
    text: "Grealish's calves insurance policy",
    category: "football",
    rarity: "common",
  },

  // International football
  {
    id: "a36",
    text: "England's penalty curse",
    category: "football",
    rarity: "legendary",
  },
  {
    id: "a37",
    text: "Germany's 7-1 flashbacks",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a38",
    text: "Italy's tactical fouling masterclass",
    category: "football",
    rarity: "common",
  },
  {
    id: "a39",
    text: "France's World Cup victory hangover",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a40",
    text: "Spain's thousand passes to nowhere",
    category: "football",
    rarity: "common",
  },

  // Modern football problems
  {
    id: "a41",
    text: "Social media transfer rumors",
    category: "football",
    rarity: "common",
  },
  {
    id: "a42",
    text: "Oil money ruining football",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a43",
    text: "Players' haircut costing more than your car",
    category: "football",
    rarity: "common",
  },
  {
    id: "a44",
    text: "Influencer footballers",
    category: "football",
    rarity: "rare",
  },
  {
    id: "a45",
    text: "FIFA's corruption scandals",
    category: "football",
    rarity: "legendary",
  },

  // Random sports madness
  {
    id: "a46",
    text: "Athletes' post-game interview clichés",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a47",
    text: "Coaches throwing tactical tantrums",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a48",
    text: "Sports journalists making up transfer stories",
    category: "sports",
    rarity: "rare",
  },
  {
    id: "a49",
    text: "Fans' delusional transfer expectations",
    category: "sports",
    rarity: "common",
  },
  {
    id: "a50",
    text: "Victory celebrations gone horribly wrong",
    category: "sports",
    rarity: "rare",
  },
];

export const actionCards: ActionCard[] = [
  {
    id: "ac1",
    name: "VAR Review",
    description: "Force all players to resubmit their cards",
    effect: "reset_submissions",
    category: "chaos",
  },
  {
    id: "ac2",
    name: "Red Card",
    description: "Skip one player's turn this round",
    effect: "skip_player",
    category: "game",
  },
  {
    id: "ac3",
    name: "Extra Time",
    description: "Double the round timer",
    effect: "double_timer",
    category: "game",
  },
  {
    id: "ac4",
    name: "Hat Trick",
    description: "Score 3 points instead of 1 if you win this round",
    effect: "triple_points",
    category: "scoring",
  },
  {
    id: "ac5",
    name: "Transfer Window",
    description: "Swap hands with another player",
    effect: "swap_hands",
    category: "chaos",
  },
];
