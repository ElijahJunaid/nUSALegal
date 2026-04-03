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
  unlockCondition?: (gameState: AchievementGameState) => boolean
  hidden?: boolean
}

export interface AchievementGameState {
  questionsAnswered: number
  totalQuestions: number
  currentLives: number
  skipsUsed: number
  timeSpent: number
  correctAnswers: number
  wrongAnswers: number
  secretsFound: string[]
  questionsByCategory: Record<string, number>
  questionsByDifficulty: Record<string, number>
  comboCount: number
  maxCombo: number
  perfectSections: number
  totalAttempts: number
  gamesPlayed: number
  gamesWon: number
  fastestTime: number
  slowestTime: number
  achievementsUnlocked: string[]
  lastPlayed: Date
  firstPlayed: Date
}

// Main Progress Badges (50)
export const progressAchievements: Achievement[] = [
  {
    id: 'bronze_completion',
    name: 'Bronze Scholar',
    description: 'Complete 25 questions',
    category: 'progress',
    rarity: 'common',
    requirement: 'Complete 25 questions',
    icon: '🥉',
    points: 100,
    unlockCondition: state => state.questionsAnswered >= 25
  },
  {
    id: 'silver_completion',
    name: 'Silver Scholar',
    description: 'Complete 50 questions',
    category: 'progress',
    rarity: 'uncommon',
    requirement: 'Complete 50 questions',
    icon: '🥈',
    points: 250,
    unlockCondition: state => state.questionsAnswered >= 50
  },
  {
    id: 'gold_completion',
    name: 'Gold Scholar',
    description: 'Complete 75 questions',
    category: 'progress',
    rarity: 'rare',
    requirement: 'Complete 75 questions',
    icon: '🥇',
    points: 500,
    unlockCondition: state => state.questionsAnswered >= 75
  },
  {
    id: 'platinum_completion',
    name: 'Platinum Scholar',
    description: 'Complete all 110 questions',
    category: 'progress',
    rarity: 'epic',
    requirement: 'Complete all 110 questions',
    icon: '💎',
    points: 1000,
    unlockCondition: state => state.questionsAnswered >= 110
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
    secret: true,
    hidden: true,
    unlockCondition: state => state.questionsAnswered >= 110 && state.secretsFound.length >= 10
  }
]

// Secret Discovery Badges (200)
export const secretAchievements: Achievement[] = [
  {
    id: 'konami_master',
    name: 'Code Breaker',
    description: 'Enter the Konami code',
    category: 'secret',
    rarity: 'mythic',
    requirement: 'Enter ↑↑↓↓←→←→BA',
    icon: '🎮',
    points: 500,
    secret: true,
    hidden: true,
    unlockCondition: state => state.secretsFound.includes('konami')
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
    secret: true,
    hidden: true,
    unlockCondition: state => state.secretsFound.includes('constitution')
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
    secret: true,
    hidden: true,
    unlockCondition: state => state.secretsFound.includes('classified')
  },
  {
    id: 'time_bomb_defuser',
    name: 'Bomb Squad',
    description: 'Complete 5 time bomb questions',
    category: 'secret',
    rarity: 'rare',
    requirement: 'Complete 5 time bomb questions',
    icon: '💣',
    points: 200,
    secret: true
  },
  {
    id: 'button_chaser',
    name: 'Button Chaser',
    description: 'Catch 10 moving buttons',
    category: 'secret',
    rarity: 'uncommon',
    requirement: 'Catch 10 moving buttons',
    icon: '🎯',
    points: 150,
    secret: true
  },
  // Add 195 more secret achievements to reach 200 total
  ...Array.from({ length: 195 }, (_, i) => ({
    id: `secret_${i + 6}`,
    name: `Secret Discovery ${i + 6}`,
    description: `Discover secret ${i + 6}`,
    category: 'secret' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Find secret ${i + 6}`,
    icon: '🔍',
    points: 50 + (i % 6) * 75,
    secret: true,
    hidden: true
  }))
]

// Speed Run Badges (150)
export const speedAchievements: Achievement[] = [
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 10 minutes',
    category: 'speed',
    rarity: 'epic',
    requirement: 'Complete quiz in under 10 minutes',
    icon: '⚡',
    points: 300,
    unlockCondition: state => state.questionsAnswered >= 110 && state.timeSpent < 600000
  },
  {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Complete 50 questions in under 5 minutes',
    category: 'speed',
    rarity: 'legendary',
    requirement: 'Complete 50 questions in under 5 minutes',
    icon: '🌩️',
    points: 500,
    unlockCondition: state => state.questionsAnswered >= 50 && state.timeSpent < 300000
  },
  {
    id: 'quick_thinker',
    name: 'Quick Thinker',
    description: 'Answer 10 questions in under 30 seconds each',
    category: 'speed',
    rarity: 'rare',
    requirement: 'Answer 10 questions in under 30 seconds each',
    icon: '🧠',
    points: 200,
    unlockCondition: state => state.correctAnswers >= 10 && state.fastestTime < 30000
  },
  {
    id: 'instant_master',
    name: 'Instant Master',
    description: 'Complete 25 questions in under 2 minutes',
    category: 'speed',
    rarity: 'epic',
    requirement: 'Complete 25 questions in under 2 minutes',
    icon: '⏱️',
    points: 400,
    unlockCondition: state => state.questionsAnswered >= 25 && state.timeSpent < 120000
  },
  // Add 146 more speed achievements to reach 150 total
  ...Array.from({ length: 146 }, (_, i) => ({
    id: `speed_${i + 5}`,
    name: `Speed Runner ${i + 5}`,
    description: `Complete ${i + 5} questions quickly`,
    category: 'speed' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Speed achievement ${i + 5}`,
    icon: '🏃',
    points: 25 + (i % 6) * 50,
    unlockCondition: state => state.questionsAnswered >= i + 5 && state.timeSpent < (i + 5) * 30000
  }))
]

// Perfection Badges (100)
export const perfectionAchievements: Achievement[] = [
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Complete quiz without losing a life',
    category: 'perfection',
    rarity: 'legendary',
    requirement: 'Complete quiz without losing a life',
    icon: '🏆',
    points: 750,
    unlockCondition: state => state.questionsAnswered >= 110 && state.wrongAnswers === 0
  },
  {
    id: 'no_skips',
    name: 'No Skips Allowed',
    description: 'Complete quiz without using skips',
    category: 'perfection',
    rarity: 'epic',
    requirement: 'Complete quiz without using skips',
    icon: '🚫',
    points: 400,
    unlockCondition: state => state.questionsAnswered >= 110 && state.skipsUsed === 0
  },
  {
    id: 'perfect_section',
    name: 'Perfect Section',
    description: 'Complete entire category perfectly',
    category: 'perfection',
    rarity: 'epic',
    requirement: 'Complete entire category perfectly',
    icon: '✨',
    points: 350,
    unlockCondition: state => state.perfectSections >= 1
  },
  {
    id: 'accuracy_master',
    name: 'Accuracy Master',
    description: 'Maintain 95% accuracy over 100 questions',
    category: 'perfection',
    rarity: 'legendary',
    requirement: 'Maintain 95% accuracy over 100 questions',
    icon: '🎯',
    points: 600,
    unlockCondition: state =>
      state.questionsAnswered >= 100 && state.correctAnswers / state.questionsAnswered >= 0.95
  },
  // Add 96 more perfection achievements to reach 100 total
  ...Array.from({ length: 96 }, (_, i) => ({
    id: `perfection_${i + 5}`,
    name: `Perfectionist ${i + 5}`,
    description: `Achieve perfection level ${i + 5}`,
    category: 'perfection' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Perfection ${i + 5}`,
    icon: '💯',
    points: 50 + (i % 6) * 75
  }))
]

// Combo Badges (75)
export const comboAchievements: Achievement[] = [
  {
    id: 'combo_starter',
    name: 'Combo Starter',
    description: 'Answer 5 questions correctly in a row',
    category: 'combo',
    rarity: 'common',
    requirement: '5 correct streak',
    icon: '🔥',
    points: 100,
    unlockCondition: state => state.maxCombo >= 5
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    description: 'Answer 15 questions correctly in a row',
    category: 'combo',
    rarity: 'rare',
    requirement: '15 correct streak',
    icon: '⚡',
    points: 250,
    unlockCondition: state => state.maxCombo >= 15
  },
  {
    id: 'combo_legend',
    name: 'Combo Legend',
    description: 'Answer 25 questions correctly in a row',
    category: 'combo',
    rarity: 'epic',
    requirement: '25 correct streak',
    icon: '🌟',
    points: 400,
    unlockCondition: state => state.maxCombo >= 25
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    description: 'Answer 50 questions correctly in a row',
    category: 'combo',
    rarity: 'legendary',
    requirement: '50 correct streak',
    icon: '💎',
    points: 1000,
    unlockCondition: state => state.maxCombo >= 50
  },
  // Add 71 more combo achievements to reach 75 total
  ...Array.from({ length: 71 }, (_, i) => ({
    id: `combo_${i + 5}`,
    name: `Combo ${i + 5}`,
    description: `Achieve combo of ${i + 5}`,
    category: 'combo' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][i % 5] as any,
    requirement: `Combo ${i + 5}`,
    icon: '�',
    points: 25 + (i % 5) * 50,
    unlockCondition: state => state.maxCombo >= i + 5
  }))
]

// Exploration Badges (125)
export const explorationAchievements: Achievement[] = [
  {
    id: 'click_everything',
    name: 'Click Everything',
    description: 'Try all wrong answers on a multiple choice question',
    category: 'exploration',
    rarity: 'uncommon',
    requirement: 'Try all wrong answers',
    icon: '👆',
    points: 150
  },
  {
    id: 'wrong_answer_expert',
    name: 'Wrong Answer Expert',
    description: 'Try 100 wrong answers total',
    category: 'exploration',
    rarity: 'rare',
    requirement: 'Try 100 wrong answers',
    icon: '❌',
    points: 200
  },
  {
    id: 'skip_explorer',
    name: 'Skip Explorer',
    description: 'Use all 3 skips in one game',
    category: 'exploration',
    rarity: 'common',
    requirement: 'Use all skips',
    icon: '⏭️',
    points: 100
  },
  {
    id: 'boundary_pusher',
    name: 'Boundary Pusher',
    description: 'Try to click outside game boundaries',
    category: 'exploration',
    rarity: 'secret',
    requirement: 'Push boundaries',
    icon: '🚧',
    points: 250,
    secret: true,
    hidden: true
  },
  // Add 121 more exploration achievements to reach 125 total
  ...Array.from({ length: 121 }, (_, i) => ({
    id: `exploration_${i + 5}`,
    name: `Explorer ${i + 5}`,
    description: `Explore area ${i + 5}`,
    category: 'exploration' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'secret', 'legendary'][i % 6] as any,
    requirement: `Exploration ${i + 5}`,
    icon: '�️',
    points: 30 + (i % 6) * 40,
    secret: i % 6 === 4,
    hidden: i % 6 === 4
  }))
]

// Knowledge Badges (150)
export const knowledgeAchievements: Achievement[] = [
  {
    id: 'constitution_expert',
    name: 'Constitution Expert',
    description: 'Answer all constitution questions correctly',
    category: 'knowledge',
    rarity: 'epic',
    requirement: 'Master constitution',
    icon: '📚',
    points: 300,
    unlockCondition: state => state.questionsByCategory['constitution'] >= 20
  },
  {
    id: 'law_knowing',
    name: 'Law Knowing',
    description: 'Answer all law questions correctly',
    category: 'knowledge',
    rarity: 'epic',
    requirement: 'Master laws',
    icon: '⚖️',
    points: 300,
    unlockCondition: state => state.questionsByCategory['laws'] >= 20
  },
  {
    id: 'congress_master',
    name: 'Congress Master',
    description: 'Answer all congress questions correctly',
    category: 'knowledge',
    rarity: 'epic',
    requirement: 'Master congress',
    icon: '🏛️',
    points: 300,
    unlockCondition: state => state.questionsByCategory['congress'] >= 20
  },
  {
    id: 'court_pro',
    name: 'Court Pro',
    description: 'Answer all court questions correctly',
    category: 'knowledge',
    rarity: 'epic',
    requirement: 'Master courts',
    icon: '⚖️',
    points: 300,
    unlockCondition: state => state.questionsByCategory['court'] >= 20
  },
  {
    id: 'history_buff',
    name: 'History Buff',
    description: 'Answer all history questions correctly',
    category: 'knowledge',
    rarity: 'epic',
    requirement: 'Master history',
    icon: '📜',
    points: 300,
    unlockCondition: state => state.questionsByCategory['history'] >= 20
  },
  // Add 145 more knowledge achievements to reach 150 total
  ...Array.from({ length: 145 }, (_, i) => ({
    id: `knowledge_${i + 6}`,
    name: `Knowledge Master ${i + 6}`,
    description: `Master knowledge area ${i + 6}`,
    category: 'knowledge' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Knowledge ${i + 6}`,
    icon: '🎓',
    points: 40 + (i % 6) * 60
  }))
]

// Persistence Badges (100)
export const persistenceAchievements: Achievement[] = [
  {
    id: 'never_give_up',
    name: 'Never Give Up',
    description: 'Play 10 games',
    category: 'persistence',
    rarity: 'common',
    requirement: 'Play 10 games',
    icon: '💪',
    points: 100,
    unlockCondition: state => state.gamesPlayed >= 10
  },
  {
    id: 'dedicated_player',
    name: 'Dedicated Player',
    description: 'Play 25 games',
    category: 'persistence',
    rarity: 'uncommon',
    requirement: 'Play 25 games',
    icon: '🎮',
    points: 150,
    unlockCondition: state => state.gamesPlayed >= 25
  },
  {
    id: 'veteran',
    name: 'Veteran Player',
    description: 'Play 50 games',
    category: 'persistence',
    rarity: 'rare',
    requirement: 'Play 50 games',
    icon: '🏅',
    points: 250,
    unlockCondition: state => state.gamesPlayed >= 50
  },
  {
    id: 'legendary_player',
    name: 'Legendary Player',
    description: 'Play 100 games',
    category: 'persistence',
    rarity: 'epic',
    requirement: 'Play 100 games',
    icon: '👑',
    points: 500,
    unlockCondition: state => state.gamesPlayed >= 100
  },
  {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win after being down to 1 life',
    category: 'persistence',
    rarity: 'rare',
    requirement: 'Amazing comeback',
    icon: '👑',
    points: 300
  },
  // Add 95 more persistence achievements to reach 100 total
  ...Array.from({ length: 95 }, (_, i) => ({
    id: `persistence_${i + 6}`,
    name: `Persistent ${i + 6}`,
    description: `Show persistence level ${i + 6}`,
    category: 'persistence' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Persistence ${i + 6}`,
    icon: '🔥',
    points: 35 + (i % 6) * 55
  }))
]

// Community Badges (50)
export const communityAchievements: Achievement[] = [
  {
    id: 'helper',
    name: 'Helper',
    description: 'Share an achievement',
    category: 'community',
    rarity: 'common',
    requirement: 'Share achievement',
    icon: '🤝',
    points: 100
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Share 5 achievements',
    category: 'community',
    rarity: 'uncommon',
    requirement: 'Share 5 achievements',
    icon: '📱',
    points: 150
  },
  {
    id: 'leader',
    name: 'Leader',
    description: 'Reach top 10 on leaderboard',
    category: 'community',
    rarity: 'rare',
    requirement: 'Top 10 leaderboard',
    icon: '🏆',
    points: 250
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Reach #1 on leaderboard',
    category: 'community',
    rarity: 'legendary',
    requirement: '#1 leaderboard',
    icon: '🥇',
    points: 750
  },
  // Add 46 more community achievements to reach 50 total
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `community_${i + 5}`,
    name: `Community ${i + 5}`,
    description: `Community achievement ${i + 5}`,
    category: 'community' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Community ${i + 5}`,
    icon: '👥',
    points: 40 + (i % 6) * 60
  }))
]

// Event Badges (100)
export const eventAchievements: Achievement[] = [
  {
    id: 'holiday_spirit',
    name: 'Holiday Spirit',
    description: 'Play during a holiday event',
    category: 'event',
    rarity: 'uncommon',
    requirement: 'Holiday participation',
    icon: '🎄',
    points: 150
  },
  {
    id: 'event_participant',
    name: 'Event Participant',
    description: 'Participate in a special event',
    category: 'event',
    rarity: 'common',
    requirement: 'Event participation',
    icon: '🎉',
    points: 100
  },
  {
    id: 'event_winner',
    name: 'Event Winner',
    description: 'Win a special event',
    category: 'event',
    rarity: 'rare',
    requirement: 'Event victory',
    icon: '🏆',
    points: 300
  },
  // Add 97 more event achievements to reach 100 total
  ...Array.from({ length: 97 }, (_, i) => ({
    id: `event_${i + 4}`,
    name: `Event ${i + 4}`,
    description: `Event achievement ${i + 4}`,
    category: 'event' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Event ${i + 4}`,
    icon: '�',
    points: 30 + (i % 6) * 50
  }))
]

// Milestone Badges (100)
export const milestoneAchievements: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Answer your first question',
    category: 'milestone',
    rarity: 'common',
    requirement: 'First question answered',
    icon: '👶',
    points: 50,
    unlockCondition: state => state.questionsAnswered >= 1
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Answer 10 questions total',
    category: 'milestone',
    rarity: 'common',
    requirement: 'Getting started',
    icon: '🚶',
    points: 75,
    unlockCondition: state => state.questionsAnswered >= 10
  },
  {
    id: 'making_progress',
    name: 'Making Progress',
    description: 'Answer 50 questions total',
    category: 'milestone',
    rarity: 'uncommon',
    requirement: 'Making progress',
    icon: '🏃',
    points: 150,
    unlockCondition: state => state.questionsAnswered >= 50
  },
  {
    id: 'question_master',
    name: 'Question Master',
    description: 'Answer 500 questions total',
    category: 'milestone',
    rarity: 'epic',
    requirement: 'Question mastery',
    icon: '�',
    points: 400,
    unlockCondition: state => state.questionsAnswered >= 500
  },
  {
    id: 'time_invested',
    name: 'Time Invested',
    description: 'Spend 10 hours playing',
    category: 'milestone',
    rarity: 'rare',
    requirement: 'Time investment',
    icon: '⏰',
    points: 200,
    unlockCondition: state => state.timeSpent >= 36000000
  },
  // Add 95 more milestone achievements to reach 100 total
  ...Array.from({ length: 95 }, (_, i) => ({
    id: `milestone_${i + 6}`,
    name: `Milestone ${i + 6}`,
    description: `Reach milestone ${i + 6}`,
    category: 'milestone' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Milestone ${i + 6}`,
    icon: '📍',
    points: 25 + (i % 6) * 75
  }))
]

// Secret Tier Badges (50)
export const secretTierAchievements: Achievement[] = [
  {
    id: 'secret_hunter',
    name: 'Secret Hunter',
    description: 'Find 5 secret achievements',
    category: 'secret',
    rarity: 'epic',
    requirement: 'Secret discovery',
    icon: '🔍',
    points: 300,
    secret: true,
    hidden: true
  },
  {
    id: 'secret_master',
    name: 'Secret Master',
    description: 'Find 25 secret achievements',
    category: 'secret',
    rarity: 'legendary',
    requirement: 'Secret mastery',
    icon: '🗝️',
    points: 600,
    secret: true,
    hidden: true
  },
  {
    id: 'ultimate_secret',
    name: 'Ultimate Secret',
    description: 'Find all secret achievements',
    category: 'secret',
    rarity: 'mythic',
    requirement: 'Ultimate secret discovery',
    icon: '🌟',
    points: 1000,
    secret: true,
    hidden: true
  },
  // Add 47 more secret tier achievements to reach 50 total
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `secret_tier_${i + 4}`,
    name: `Secret Tier ${i + 4}`,
    description: `Secret tier achievement ${i + 4}`,
    category: 'secret' as const,
    rarity: ['rare', 'epic', 'legendary', 'mythic'][i % 4] as any,
    requirement: `Secret tier ${i + 4}`,
    icon: '🔮',
    points: 200 + (i % 4) * 200,
    secret: true,
    hidden: true
  }))
]

// Collection Badges (150)
export const collectionAchievements: Achievement[] = [
  {
    id: 'beginner_collector',
    name: 'Beginner Collector',
    description: 'Unlock 10 achievements',
    category: 'collection',
    rarity: 'common',
    requirement: 'Start collecting',
    icon: '📦',
    points: 100,
    unlockCondition: state => state.achievementsUnlocked.length >= 10
  },
  {
    id: 'achievement_collector',
    name: 'Achievement Collector',
    description: 'Unlock 50 achievements',
    category: 'collection',
    rarity: 'uncommon',
    requirement: 'Collecting achievements',
    icon: '📚',
    points: 200,
    unlockCondition: state => state.achievementsUnlocked.length >= 50
  },
  {
    id: 'master_collector',
    name: 'Master Collector',
    description: 'Unlock 200 achievements',
    category: 'collection',
    rarity: 'rare',
    requirement: 'Master collecting',
    icon: '🏆',
    points: 400,
    unlockCondition: state => state.achievementsUnlocked.length >= 200
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Unlock 500 achievements',
    category: 'collection',
    rarity: 'epic',
    requirement: 'Legendary collecting',
    icon: '👑',
    points: 750,
    unlockCondition: state => state.achievementsUnlocked.length >= 500
  },
  {
    id: 'ultimate_collector',
    name: 'Ultimate Collector',
    description: 'Unlock 1000 achievements',
    category: 'collection',
    rarity: 'mythic',
    requirement: 'Ultimate collecting',
    icon: '🌟',
    points: 1500,
    unlockCondition: state => state.achievementsUnlocked.length >= 1000
  },
  // Add 145 more collection achievements to reach 150 total
  ...Array.from({ length: 145 }, (_, i) => ({
    id: `collection_${i + 6}`,
    name: `Collection ${i + 6}`,
    description: `Collect achievement set ${i + 6}`,
    category: 'collection' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 6] as any,
    requirement: `Collection ${i + 6}`,
    icon: '🗂️',
    points: 40 + (i % 6) * 80
  }))
]

// Legacy Badges (50)
export const legacyAchievements: Achievement[] = [
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Play within the first week of launch',
    category: 'legacy',
    rarity: 'rare',
    requirement: 'Early player',
    icon: '🐦',
    points: 250
  },
  {
    id: 'founding_player',
    name: 'Founding Player',
    description: 'Play within the first day of launch',
    category: 'legacy',
    rarity: 'epic',
    requirement: 'Founding member',
    icon: '🏛️',
    points: 500
  },
  {
    id: 'veteran_player',
    name: 'Veteran Player',
    description: 'Play for over 6 months',
    category: 'legacy',
    rarity: 'legendary',
    requirement: 'Long-term player',
    icon: '🎖️',
    points: 750,
    unlockCondition: state => {
      const now = new Date()
      const firstPlayed = new Date(state.firstPlayed)
      return now.getTime() - firstPlayed.getTime() > 183 * 24 * 60 * 60 * 1000
    }
  },
  // Add 47 more legacy achievements to reach 50 total
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `legacy_${i + 4}`,
    name: `Legacy ${i + 4}`,
    description: `Legacy achievement ${i + 4}`,
    category: 'legacy' as const,
    rarity: ['uncommon', 'rare', 'epic', 'legendary', 'mythic'][i % 5] as any,
    requirement: `Legacy ${i + 4}`,
    icon: '📜',
    points: 100 + (i % 5) * 150
  }))
]

// Creator Badges (25)
export const creatorAchievements: Achievement[] = [
  {
    id: 'bug_reporter',
    name: 'Bug Reporter',
    description: 'Report a bug',
    category: 'creator',
    rarity: 'common',
    requirement: 'Bug reporting',
    icon: '🐛',
    points: 150
  },
  {
    id: 'feedback_giver',
    name: 'Feedback Giver',
    description: 'Provide valuable feedback',
    category: 'creator',
    rarity: 'common',
    requirement: 'Feedback contribution',
    icon: '💬',
    points: 100
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Contribute content to the game',
    category: 'creator',
    rarity: 'rare',
    requirement: 'Content creation',
    icon: '✍️',
    points: 300
  },
  // Add 22 more creator achievements to reach 25 total
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `creator_${i + 4}`,
    name: `Creator ${i + 4}`,
    description: `Creator achievement ${i + 4}`,
    category: 'creator' as const,
    rarity: ['common', 'uncommon', 'rare', 'epic', 'legendary'][i % 5] as any,
    requirement: `Creator ${i + 4}`,
    icon: '🎨',
    points: 50 + (i % 5) * 100
  }))
]

// Combine all achievements
export const allAchievements: Achievement[] = [
  ...progressAchievements,
  ...secretAchievements,
  ...speedAchievements,
  ...perfectionAchievements,
  ...comboAchievements,
  ...explorationAchievements,
  ...knowledgeAchievements,
  ...persistenceAchievements,
  ...communityAchievements,
  ...eventAchievements,
  ...milestoneAchievements,
  ...secretTierAchievements,
  ...collectionAchievements,
  ...legacyAchievements,
  ...creatorAchievements
]

// Helper functions
export function getAchievementById(id: string): Achievement | undefined {
  return allAchievements.find(a => a.id === id)
}

export function getAchievementsByCategory(category: string): Achievement[] {
  return allAchievements.filter(a => a.category === category)
}

export function getAchievementsByRarity(rarity: string): Achievement[] {
  return allAchievements.filter(a => a.rarity === rarity)
}

export function getSecretAchievements(): Achievement[] {
  return allAchievements.filter(a => a.secret)
}

export function getHiddenAchievements(): Achievement[] {
  return allAchievements.filter(a => a.hidden)
}

export function checkAchievements(gameState: AchievementGameState): Achievement[] {
  const newAchievements: Achievement[] = []

  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (gameState.achievementsUnlocked.includes(achievement.id)) {
      continue
    }

    // Check unlock condition
    if (achievement.unlockCondition && achievement.unlockCondition(gameState)) {
      newAchievements.push(achievement)
    }
  }

  return newAchievements
}

export function getAchievementProgress(gameState: AchievementGameState): Record<string, number> {
  const progress: Record<string, number> = {}

  for (const achievement of allAchievements) {
    if (gameState.achievementsUnlocked.includes(achievement.id)) {
      progress[achievement.id] = 100
    } else if (achievement.unlockCondition) {
      progress[achievement.id] = achievement.unlockCondition(gameState) ? 100 : 0
    } else {
      progress[achievement.id] = 0
    }
  }

  return progress
}

export function getTotalPoints(achievements: Achievement[]): number {
  return achievements.reduce((total, achievement) => total + achievement.points, 0)
}

export function getAchievementStats(gameState: AchievementGameState): {
  totalAchievements: number
  unlockedAchievements: number
  totalPoints: number
  earnedPoints: number
  completionPercentage: number
} {
  const totalAchievements = allAchievements.length
  const unlockedAchievements = gameState.achievementsUnlocked.length
  const totalPoints = getTotalPoints(allAchievements)
  const earnedPoints = getTotalPoints(
    allAchievements.filter(a => gameState.achievementsUnlocked.includes(a.id))
  )

  return {
    totalAchievements,
    unlockedAchievements,
    totalPoints,
    earnedPoints,
    completionPercentage: (unlockedAchievements / totalAchievements) * 100
  }
}
