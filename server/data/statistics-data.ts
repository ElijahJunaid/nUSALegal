export const caseStatistics = {
  totalCases: 247,
  convictionRate: 68,
  avgSentence: 18,
  activeTrials: 12
}

export const topCharges = [
  { name: 'Assault', count: 45, percentage: 100 },
  { name: 'Theft', count: 38, percentage: 84 },
  { name: 'Drug Possession', count: 32, percentage: 71 },
  { name: 'Trespassing', count: 28, percentage: 62 },
  { name: 'Robbery', count: 21, percentage: 47 }
]

export const caseOutcomes = [
  { type: 'Convicted', percentage: 68, count: 168, color: '#ef4444' },
  { type: 'Acquitted', percentage: 22, count: 54, color: '#22c55e' },
  { type: 'Dismissed', percentage: 7, count: 17, color: '#3b82f6' },
  { type: 'Mistrial', percentage: 3, count: 8, color: '#f59e0b' }
]

export const departmentStats = [
  { name: 'FBI', winRate: 78, color: '#3b82f6' },
  { name: 'State Police', winRate: 72, color: '#8b5cf6' },
  { name: 'Sheriff\'s Office', winRate: 65, color: '#10b981' },
  { name: 'City Police', winRate: 61, color: '#f59e0b' }
]

export const commonDefenses = [
  { strategy: 'Self-Defense', timesUsed: 34, successRate: 41 },
  { strategy: 'Alibi', timesUsed: 28, successRate: 35 },
  { strategy: 'Insufficient Evidence', timesUsed: 52, successRate: 28 },
  { strategy: 'Illegal Search/Seizure', timesUsed: 19, successRate: 63 },
  { strategy: 'Mistaken Identity', timesUsed: 15, successRate: 20 }
]

export const sentencingTrends = {
  avgLength: 18,
  mostCommon: '12 months probation',
  pleaRate: 64,
  appealRate: 12
}

export const topProsecutors = [
  { name: 'Alex Morrison', wins: 42, losses: 8, winRate: 84 },
  { name: 'Sarah Chen', wins: 38, losses: 12, winRate: 76 },
  { name: 'Michael Rodriguez', wins: 35, losses: 15, winRate: 70 },
  { name: 'Emily Thompson', wins: 29, losses: 11, winRate: 72 },
  { name: 'David Park', wins: 27, losses: 13, winRate: 68 }
]

export const topDefense = [
  { name: 'Jessica Williams', wins: 31, losses: 19, winRate: 62 },
  { name: 'Robert Taylor', wins: 28, losses: 22, winRate: 56 },
  { name: 'Amanda Garcia', wins: 25, losses: 20, winRate: 56 },
  { name: 'James Anderson', wins: 23, losses: 17, winRate: 58 },
  { name: 'Lisa Martinez', wins: 21, losses: 19, winRate: 53 }
]

export const topJudges = [
  { name: 'Hon. Patricia Davis', casesPresided: 89 },
  { name: 'Hon. John Mitchell', casesPresided: 76 },
  { name: 'Hon. Maria Santos', casesPresided: 68 },
  { name: 'Hon. William Brown', casesPresided: 61 },
  { name: 'Hon. Jennifer Lee', casesPresided: 54 }
]

export const mostActiveDepts = [
  { name: 'FBI', casesFiled: 94 },
  { name: 'State Police', casesFiled: 78 },
  { name: 'Sheriff\'s Office', casesFiled: 52 },
  { name: 'City Police', casesFiled: 48 },
  { name: 'DEA', casesFiled: 31 }
]
