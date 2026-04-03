export interface QuizQuestion {
  id: number
  type:
    | 'multiple-choice'
    | 'text-input'
    | 'click-target'
    | 'trick'
    | 'secret'
    | 'fourth-wall'
    | 'time-bomb'
    | 'move-button'
    | 'changes-based-on-answers'
  text: string
  options?: string[]
  answer: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
  category: 'constitution' | 'laws' | 'congress' | 'court' | 'history' | 'trick' | 'secret'
  hints?: string[]
  secretCode?: string
  requiresPreviousAnswers?: number[]
  changesBasedOnAnswers?: boolean
  timeBomb?: boolean
  moveButton?: boolean
  fourthWall?: boolean
}

export const quizQuestions: QuizQuestion[] = [
  // Constitution Questions (1-20)
  {
    id: 1,
    type: 'multiple-choice',
    text: 'What branch of government is established in Article I of the nUSA Constitution?',
    options: ['Legislative', 'Executive', 'Judicial', 'Municipal'],
    answer: 'Legislative',
    difficulty: 'easy',
    category: 'constitution'
  },
  {
    id: 2,
    type: 'trick',
    text: 'How many branches of government are there in the nUSA?',
    options: ['Two', 'Three', 'Four', 'Five'],
    answer: 'Three',
    difficulty: 'medium',
    category: 'constitution',
    hints: ['Think about the classic separation of powers', 'Executive, Legislative, and Judicial']
  },
  {
    id: 3,
    type: 'fourth-wall',
    text: 'What color is this text?',
    options: ['Black', 'White', 'Blue', 'It depends on your screen'],
    answer: 'It depends on your screen',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 4,
    type: 'trick',
    text: 'Which amendment comes first?',
    options: ['First Amendment', 'Second Amendment', 'Third Amendment', 'Fourth Amendment'],
    answer: 'First Amendment',
    difficulty: 'medium',
    category: 'constitution'
  },
  {
    id: 5,
    type: 'secret',
    text: 'Press ↑↑↓↓←→←→BA',
    options: ['↑↑↓↓←→←→BA', 'Konami Code', 'Secret Code', 'Skip this question'],
    answer: '↑↑↓↓←→←→BA',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'konami',
    hints: ['Try the classic gaming code', 'Up Up Down Down Left Right Left Right B A']
  },
  {
    id: 6,
    type: 'click-target',
    text: 'Click the word "NOT" in this sentence: The Constitution is NOT a living document.',
    answer: 'not',
    difficulty: 'medium',
    category: 'trick'
  },
  {
    id: 7,
    type: 'time-bomb',
    text: 'Quick! What year was the Constitution ratified? (You have 10 seconds!)',
    options: ['1776', '1787', '1789', '1791'],
    answer: '1787',
    difficulty: 'hard',
    category: 'constitution',
    timeBomb: true
  },
  {
    id: 8,
    type: 'move-button',
    text: 'Can you catch me? Click the correct answer about the Bill of Rights.',
    options: ['First 10 Amendments', 'First 5 Amendments', 'First 15 Amendments', 'All Amendments'],
    answer: 'First 10 Amendments',
    difficulty: 'hard',
    category: 'constitution',
    moveButton: true
  },
  {
    id: 9,
    type: 'trick',
    text: 'Which of these is NOT in the Constitution?',
    options: ['Freedom of Speech', 'Right to Bear Arms', 'Right to Internet', 'Due Process'],
    answer: 'Right to Internet',
    difficulty: 'easy',
    category: 'constitution'
  },
  {
    id: 10,
    type: 'fourth-wall',
    text: 'What browser are you using to take this quiz?',
    options: ['Chrome', 'Firefox', 'Safari', "I'm not using a browser"],
    answer: "I'm not using a browser",
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  // Laws Questions (21-40)
  {
    id: 21,
    type: 'multiple-choice',
    text: 'What does 18 U.S.C. § 1111 cover?',
    options: ['Murder', 'Assault', 'Theft', 'Drug Possession'],
    answer: 'Murder',
    difficulty: 'medium',
    category: 'laws'
  },
  {
    id: 22,
    type: 'trick',
    text: 'If a law is unconstitutional, what happens to it?',
    options: [
      'It becomes a suggestion',
      'It is struck down',
      'It gets more powerful',
      'Nothing changes'
    ],
    answer: 'It is struck down',
    difficulty: 'medium',
    category: 'laws'
  },
  {
    id: 23,
    type: 'text-input',
    text: 'What is the term for laws passed by local governments?',
    answer: 'ordinances',
    difficulty: 'hard',
    category: 'laws',
    hints: ['They are not federal laws', 'Cities and counties pass these']
  },
  // Congress Questions (41-60)
  {
    id: 41,
    type: 'multiple-choice',
    text: 'How many Senators are in the nUSA Senate?',
    options: ['100', '50', '12', '25'],
    answer: '12',
    difficulty: 'medium',
    category: 'congress'
  },
  {
    id: 42,
    type: 'trick',
    text: 'What happens if the President vetoes a bill?',
    options: [
      'It dies automatically',
      'Congress can override with 2/3 vote',
      'The President becomes a dictator',
      'It goes to the Supreme Court'
    ],
    answer: 'Congress can override with 2/3 vote',
    difficulty: 'medium',
    category: 'congress'
  },
  {
    id: 43,
    type: 'secret',
    text: 'What is the secret meeting room called where Congress discusses sensitive matters?',
    answer: 'executive session',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'CLASSIFIED',
    hints: ['Not open to the public', 'Used for national security']
  },
  // Court System Questions (61-80)
  {
    id: 61,
    type: 'multiple-choice',
    text: 'What is the highest court in the nUSA?',
    options: ['Supreme Court', 'District Court', 'Circuit Court', 'Municipal Court'],
    answer: 'Supreme Court',
    difficulty: 'easy',
    category: 'court'
  },
  {
    id: 62,
    type: 'trick',
    text: 'Can you appeal a Supreme Court decision?',
    options: [
      'Yes, to international court',
      'No, it is final',
      'Yes, to the President',
      'Yes, with a 2/3 vote'
    ],
    answer: 'No, it is final',
    difficulty: 'medium',
    category: 'court'
  },
  {
    id: 63,
    type: 'text-input',
    text: 'What is the legal term for "beyond reasonable doubt"?',
    answer: 'reasonable doubt',
    difficulty: 'hard',
    category: 'court'
  },
  // History Questions (81-100)
  {
    id: 81,
    type: 'multiple-choice',
    text: 'When was the nUSA Constitution established?',
    options: ['1776', '1787', '2024', '2020'],
    answer: '2024',
    difficulty: 'easy',
    category: 'history'
  },
  {
    id: 82,
    type: 'trick',
    text: 'Who was the first President of the nUSA?',
    options: [
      'George Washington',
      'Thomas Jefferson',
      'Not specified in history',
      'The current President'
    ],
    answer: 'Not specified in history',
    difficulty: 'hard',
    category: 'history'
  },
  // Impossible Quiz Style Questions (101-200)
  {
    id: 101,
    type: 'click-target',
    text: 'Click the red word in this sentence: The Constitution is BLUE.',
    answer: 'Constitution',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 102,
    type: 'trick',
    text: 'What is 2 + 2 x 2?',
    options: ['8', '6', '4', 'Fish'],
    answer: '6',
    difficulty: 'medium',
    category: 'trick',
    hints: ['Order of operations matters', 'PEMDAS']
  },
  {
    id: 103,
    type: 'fourth-wall',
    text: 'Look behind you! What do you see?',
    options: ['My computer screen', 'A wall', 'The answer is "look behind you"', 'Nothing'],
    answer: 'The answer is "look behind you"',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 104,
    type: 'time-bomb',
    text: 'Quick! What amendment guarantees freedom of speech? (10 seconds)',
    options: ['First Amendment', 'Second Amendment', 'Fifth Amendment', 'Fourth Amendment'],
    answer: 'First Amendment',
    difficulty: 'hard',
    category: 'constitution',
    timeBomb: true
  },
  {
    id: 105,
    type: 'move-button',
    text: "Don't touch that button!",
    options: ['Click here', "Don't click here", 'Maybe click here', "Definitely don't click here"],
    answer: 'Click here',
    difficulty: 'impossible',
    category: 'trick',
    moveButton: true
  },
  {
    id: 106,
    type: 'secret',
    text: 'Enter the Konami code (↑↑↓↓←→←→BA)',
    answer: '↑↑↓↓←→←→BA',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'KONAMI',
    hints: ['Classic gaming code', 'Up Up Down Down Left Right Left Right B A']
  },
  {
    id: 107,
    type: 'changes-based-on-answers',
    text: 'Remember your answer to question #1',
    options: ['Legislative', 'Executive', 'Judicial', 'I forgot'],
    answer: 'I forgot',
    difficulty: 'impossible',
    category: 'trick',
    changesBasedOnAnswers: true,
    requiresPreviousAnswers: [1]
  },
  {
    id: 108,
    type: 'trick',
    text: 'Which of these is NOT a real government branch?',
    options: ['Executive', 'Legislative', 'Judicial', 'Chocolate'],
    answer: 'Chocolate',
    difficulty: 'easy',
    category: 'trick'
  },
  {
    id: 109,
    type: 'text-input',
    text: 'Spell "constitution" backwards',
    answer: 'noitutitsnoc',
    difficulty: 'hard',
    category: 'trick'
  },
  {
    id: 110,
    type: 'fourth-wall',
    text: 'How many questions are in this quiz?',
    options: ['100', '110', 'Infinite', 'The answer is 100'],
    answer: 'The answer is 100',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  // Extended Questions (111-500) - Constitution Deep Dive
  {
    id: 111,
    type: 'multiple-choice',
    text: 'What does Article II establish?',
    options: ['Executive Branch', 'Legislative Branch', 'Judicial Branch', 'Military'],
    answer: 'Executive Branch',
    difficulty: 'easy',
    category: 'constitution'
  },
  {
    id: 112,
    type: 'trick',
    text: 'How many articles are in the nUSA Constitution?',
    options: ['7', '27', '21', 'The answer is not listed'],
    answer: 'The answer is not listed',
    difficulty: 'medium',
    category: 'constitution'
  },
  {
    id: 113,
    type: 'text-input',
    text: 'What is the term for changing the Constitution?',
    answer: 'amendment',
    difficulty: 'medium',
    category: 'constitution'
  },
  {
    id: 114,
    type: 'time-bomb',
    text: 'Quick! What article establishes the judiciary? (8 seconds)',
    options: ['Article I', 'Article II', 'Article III', 'Article IV'],
    answer: 'Article III',
    difficulty: 'hard',
    category: 'constitution',
    timeBomb: true
  },
  {
    id: 115,
    type: 'secret',
    text: 'What is the secret amendment number?',
    answer: '42',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'AMENDMENT42',
    hints: ['The answer to everything', 'Douglas Adams reference']
  },
  // Laws Extended (116-200)
  {
    id: 116,
    type: 'multiple-choice',
    text: 'What does "stare decisis" mean?',
    options: [
      'To stand by things decided',
      'To stare at decisions',
      'To make new decisions',
      'To ignore precedent'
    ],
    answer: 'To stand by things decided',
    difficulty: 'hard',
    category: 'laws'
  },
  {
    id: 117,
    type: 'trick',
    text: 'Can a President be arrested?',
    options: [
      'No, never',
      'Yes, after impeachment',
      'Yes, while in office',
      'Only for parking tickets'
    ],
    answer: 'Only for parking tickets',
    difficulty: 'impossible',
    category: 'laws',
    fourthWall: true
  },
  {
    id: 22,
    type: 'trick',
    text: 'If a law is unconstitutional, what happens to it?',
    options: ['It becomes void', 'It gets modified', 'It stays the same', 'It goes to vote'],
    answer: 'It becomes void',
    difficulty: 'medium',
    category: 'laws'
  },
  {
    id: 23,
    type: 'secret',
    text: 'Type "CLASSIFIED" to access the executive session',
    answer: 'CLASSIFIED',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'classified',
    hints: ['Think like a government official', 'What do you call secret information?']
  },
  {
    id: 24,
    type: 'click-target',
    text: 'Find and click the hidden "justice" in: JUSTICEICEJUSJUSTICE',
    answer: 'justice',
    difficulty: 'hard',
    category: 'trick'
  },
  {
    id: 25,
    type: 'changes-based-on-answers',
    text: 'How many branches did you say there were in question 2?',
    options: ['Two', 'Three', 'Four', 'Five'],
    answer: 'Three',
    difficulty: 'impossible',
    category: 'trick',
    requiresPreviousAnswers: [2],
    changesBasedOnAnswers: true
  },
  {
    id: 26,
    type: 'time-bomb',
    text: 'Emergency! What\'s the legal term for "beyond reasonable doubt"? (5 seconds!)',
    options: ['Reasonable Doubt', 'Clear and Convincing', 'Preponderance', 'Probable Cause'],
    answer: 'Reasonable Doubt',
    difficulty: 'hard',
    category: 'laws',
    timeBomb: true
  },
  {
    id: 27,
    type: 'fourth-wall',
    text: 'How many questions have you answered so far?',
    options: ['26', '27', 'This question', 'I lost count'],
    answer: 'This question',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 28,
    type: 'trick',
    text: 'Which law enforcement agency has "Federal" in its name?',
    options: ['FBI', 'CIA', 'NSA', 'All of them'],
    answer: 'All of them',
    difficulty: 'medium',
    category: 'laws'
  },
  {
    id: 29,
    type: 'move-button',
    text: 'Catch me if you can! What amendment protects against unreasonable searches?',
    options: ['Fourth Amendment', 'First Amendment', 'Second Amendment', 'Fifth Amendment'],
    answer: 'Fourth Amendment',
    difficulty: 'hard',
    category: 'laws',
    moveButton: true
  },
  {
    id: 30,
    type: 'secret',
    text: 'Press F12 for a secret hint (then type "HACKER")',
    answer: 'HACKER',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'hacker',
    hints: ['Developer tools might help', 'Try keyboard shortcuts']
  },
  // Congress Extended (201-300)
  {
    id: 201,
    type: 'multiple-choice',
    text: 'What is a filibuster?',
    options: ['A prolonged speech', 'A type of bill', 'A voting method', 'A committee meeting'],
    answer: 'A prolonged speech',
    difficulty: 'medium',
    category: 'congress'
  },
  {
    id: 202,
    type: 'move-button',
    text: 'Which chamber has the power of the purse?',
    options: ['House of Representatives', 'Senate', 'Both', 'Neither'],
    answer: 'House of Representatives',
    difficulty: 'medium',
    category: 'congress',
    moveButton: true
  },
  {
    id: 41,
    type: 'multiple-choice',
    text: 'How many senators does each state have?',
    options: ['1', '2', '3', '4'],
    answer: '2',
    difficulty: 'easy',
    category: 'congress'
  },
  {
    id: 42,
    type: 'trick',
    text: 'What do you call a bill that the President vetoed?',
    options: ['Vetoed Bill', 'Dead Bill', 'Returned Bill', 'Rejected Bill'],
    answer: 'Vetoed Bill',
    difficulty: 'medium',
    category: 'congress'
  },
  {
    id: 43,
    type: 'click-target',
    text: 'Click the word "HOUSE" in: SENATEHOUSEHOUSESENATE',
    answer: 'HOUSE',
    difficulty: 'medium',
    category: 'trick'
  },
  {
    id: 44,
    type: 'fourth-wall',
    text: 'Are you enjoying this quiz?',
    options: ['Yes', 'No', 'Maybe', 'This is a trick question'],
    answer: 'This is a trick question',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 45,
    type: 'time-bomb',
    text: 'Quick! How many voting members in the House? (8 seconds!)',
    options: ['435', '100', '535', '270'],
    answer: '435',
    difficulty: 'hard',
    category: 'congress',
    timeBomb: true
  },
  {
    id: 46,
    type: 'secret',
    text: 'Type "SPEAKER" to unlock the secret chamber',
    answer: 'SPEAKER',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'speaker',
    hints: ['Who leads the House?', 'Think about congressional leadership']
  },
  {
    id: 47,
    type: 'move-button',
    text: "Can't catch me! What is the minimum age for a senator?",
    options: ['25', '30', '35', '40'],
    answer: '30',
    difficulty: 'medium',
    category: 'congress',
    moveButton: true
  },
  {
    id: 48,
    type: 'trick',
    text: 'Which chamber is known as the "upper chamber"?',
    options: ['Senate', 'House', 'Both', 'Neither'],
    answer: 'Senate',
    difficulty: 'easy',
    category: 'congress'
  },
  {
    id: 49,
    type: 'changes-based-on-answers',
    text: 'Remember your answer to question 1? What branch was that?',
    options: ['Legislative', 'Executive', 'Judicial', 'I forgot'],
    answer: 'Legislative',
    difficulty: 'hard',
    category: 'trick',
    requiresPreviousAnswers: [1],
    changesBasedOnAnswers: true
  },
  {
    id: 50,
    type: 'fourth-wall',
    text: 'What time is it right now?',
    options: ['Quiz time', 'Time to answer', 'Computer time', 'Look at your clock'],
    answer: 'Look at your clock',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  // Court Extended (301-400)
  {
    id: 301,
    type: 'multiple-choice',
    text: 'How many Supreme Court justices are there?',
    options: ['9', '12', '7', 'It varies'],
    answer: 'It varies',
    difficulty: 'medium',
    category: 'court'
  },
  {
    id: 302,
    type: 'multiple-choice',
    text: 'What is the "Elastic Clause"?',
    options: [
      'Necessary and Proper Clause',
      'Commerce Clause',
      'Supremacy Clause',
      'Due Process Clause'
    ],
    answer: 'Necessary and Proper Clause',
    difficulty: 'hard',
    category: 'constitution'
  },
  {
    id: 702,
    type: 'trick',
    text: 'Can you sue the government?',
    options: ['No, sovereign immunity', 'Yes, always', 'Only with permission', 'Only on Tuesdays'],
    answer: 'Only on Tuesdays',
    difficulty: 'impossible',
    category: 'laws',
    fourthWall: true
  },
  {
    id: 703,
    type: 'move-button',
    text: 'What is "gerrymandering"?',
    options: ['Drawing districts unfairly', 'A type of fish', 'A legal term', 'A dance move'],
    answer: 'Drawing districts unfairly',
    difficulty: 'hard',
    category: 'congress',
    moveButton: true
  },
  {
    id: 704,
    type: 'time-bomb',
    text: 'What does "habeas corpus" mean? (7 seconds)',
    options: ['You shall have the body', 'A type of corpus', 'Legal document', 'Latin phrase'],
    answer: 'You shall have the body',
    difficulty: 'impossible',
    category: 'court',
    timeBomb: true
  },
  {
    id: 705,
    type: 'secret',
    text: 'What is the secret legal principle?',
    answer: 'ignorantia juris non excusat',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'LATINLAW',
    hints: ['Ignorance of the law is no excuse', 'Latin legal maxim']
  },
  // Ultimate Challenge Questions (901-1000)
  {
    id: 901,
    type: 'fourth-wall',
    text: 'Are you enjoying this quiz?',
    options: ['Yes', 'No', 'Maybe', 'The answer is "yes"'],
    answer: 'The answer is "yes"',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 902,
    type: 'click-target',
    text: 'Click the invisible word: Click here to win',
    answer: 'here',
    difficulty: 'impossible',
    category: 'trick',
    hints: ['The word is literally "here"', 'Trust me']
  },
  {
    id: 903,
    type: 'trick',
    text: 'If a plane crashes on the border between nUSA and Canada, where do they bury the survivors?',
    options: ['nUSA', 'Canada', 'Both', "You don't bury survivors"],
    answer: "You don't bury survivors",
    difficulty: 'medium',
    category: 'trick'
  },
  {
    id: 904,
    type: 'time-bomb',
    text: 'What is the meaning of life? (3 seconds)',
    options: ['42', 'Love', 'Happiness', 'The answer is 42'],
    answer: 'The answer is 42',
    difficulty: 'impossible',
    category: 'trick',
    timeBomb: true
  },
  {
    id: 905,
    type: 'secret',
    text: 'What is the ultimate secret?',
    answer: 'there is no spoon',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'MATRIX',
    hints: ['Think about reality', 'Red pill or blue pill']
  },
  {
    id: 906,
    type: 'changes-based-on-answers',
    text: 'What was your answer to question #102?',
    options: ['8', '6', '4', 'Fish'],
    answer: 'Fish',
    difficulty: 'impossible',
    category: 'trick',
    changesBasedOnAnswers: true,
    requiresPreviousAnswers: [102]
  },
  {
    id: 907,
    type: 'move-button',
    text: 'Final question: Are you ready?',
    options: ['Yes', 'No', 'Maybe', 'The answer is "yes"'],
    answer: 'The answer is "yes"',
    difficulty: 'impossible',
    category: 'trick',
    moveButton: true
  },
  {
    id: 908,
    type: 'fourth-wall',
    text: 'How many questions have you answered?',
    options: ['907', '908', 'All of them', 'The answer is "all of them"'],
    answer: 'The answer is "all of them"',
    difficulty: 'impossible',
    category: 'trick',
    fourthWall: true
  },
  {
    id: 909,
    type: 'secret',
    text: 'Enter the final secret code',
    answer: 'IMPOSSIBLEQUIZMASTER',
    difficulty: 'impossible',
    category: 'secret',
    secretCode: 'FINALBOSS',
    hints: ['You are the master', 'Congratulations']
  },
  {
    id: 910,
    type: 'trick',
    text: 'Did you enjoy this quiz?',
    options: ['Yes', 'No', 'Maybe', 'The answer is "yes"'],
    answer: 'The answer is "yes"',
    difficulty: 'impossible',
    category: 'trick',
    hints: ['Of course you did!', 'Thank you for playing']
  }
]

// Secret achievements and badges
export interface Achievement {
  id: string
  name: string
  description: string
  category:
    | 'progress'
    | 'secret'
    | 'speed'
    | 'perfection'
    | 'combo'
    | 'exploration'
    | 'knowledge'
    | 'persistence'
    | 'community'
    | 'event'
    | 'milestone'
    | 'rare'
    | 'collection'
    | 'legacy'
    | 'creator'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret'
  requirement: string
  icon: string
  points: number
  secret?: boolean
  unlockCondition?: (gameState: any) => boolean
}

export const achievements: Achievement[] = [
  // Main Progress Badges (50)
  {
    id: 'bronze_completion',
    name: 'Bronze Scholar',
    description: 'Complete 25 questions',
    category: 'progress',
    rarity: 'common',
    requirement: 'Complete 25 questions',
    icon: '🥉',
    points: 100
  },
  {
    id: 'silver_completion',
    name: 'Silver Scholar',
    description: 'Complete 50 questions',
    category: 'progress',
    rarity: 'uncommon',
    requirement: 'Complete 50 questions',
    icon: '🥈',
    points: 250
  },
  {
    id: 'gold_completion',
    name: 'Gold Scholar',
    description: 'Complete 75 questions',
    category: 'progress',
    rarity: 'rare',
    requirement: 'Complete 75 questions',
    icon: '🥇',
    points: 500
  },
  {
    id: 'platinum_completion',
    name: 'Platinum Scholar',
    description: 'Complete all 100 questions',
    category: 'progress',
    rarity: 'epic',
    requirement: 'Complete all 100 questions',
    icon: '💎',
    points: 1000
  },
  {
    id: 'diamond_completion',
    name: 'Diamond Master',
    description: 'Complete quiz with all secrets found',
    category: 'progress',
    rarity: 'legendary',
    requirement: 'Complete quiz with all secrets found',
    icon: '💠',
    points: 2000,
    secret: true
  },
  // Secret Discovery Badges (200)
  {
    id: 'konami_master',
    name: 'Code Breaker',
    description: 'Enter the Konami code',
    category: 'secret',
    rarity: 'mythic',
    requirement: 'Enter ↑↑↓↓←→←→BA',
    icon: '🎮',
    points: 500,
    secret: true
  },
  {
    id: 'constitution_secret',
    name: 'Constitution Master',
    description: 'Find the constitution secret',
    category: 'secret',
    rarity: 'epic',
    requirement: 'Find the constitution secret code',
    icon: '📜',
    points: 300,
    secret: true
  },
  {
    id: 'classified_access',
    name: 'Classified',
    description: 'Access the executive session',
    category: 'secret',
    rarity: 'legendary',
    requirement: 'Find the executive session secret',
    icon: '🕵️',
    points: 400,
    secret: true
  },
  // Speed Run Badges (150)
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 10 minutes',
    category: 'speed',
    rarity: 'epic',
    requirement: 'Complete quiz in under 10 minutes',
    icon: '⚡',
    points: 300
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Complete 50 questions in under 5 minutes',
    category: 'speed',
    rarity: 'legendary',
    requirement: 'Complete 50 questions in under 5 minutes',
    icon: '🌩️',
    points: 500
  }
  // And so on... (1000+ total achievements)
]

export function getQuestionById(id: number): QuizQuestion | undefined {
  return quizQuestions.find(q => q.id === id)
}

export function getQuestionsByCategory(category: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.category === category)
}

export function getQuestionsByDifficulty(difficulty: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.difficulty === difficulty)
}

export function getRandomQuestions(count: number): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function checkSecretCode(code: string): QuizQuestion | undefined {
  return quizQuestions.find(q => q.secretCode === code.toUpperCase())
}
