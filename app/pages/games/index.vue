<template>
  <div class="games-hub">
    <div class="hub-header">
      <h1 class="hub-title">🎮 nUSA Games Hub</h1>
      <p class="hub-subtitle">Challenge yourself with our collection of educational games</p>
    </div>

    <div class="games-grid">
      <div class="game-card featured" @click="navigateTo('/game')">
        <div class="game-header">
          <div class="game-icon">🧠</div>
          <div class="game-info">
            <h2 class="game-title">The Impossible nUSA Quiz</h2>
            <div class="game-badge featured-badge">FEATURED</div>
          </div>
        </div>
        <div class="game-description">
          <p>
            Test your knowledge with 1000+ questions about the nUSA Constitution, laws, and
            government. Features trick questions, secret codes, and 1000+ achievements!
          </p>
        </div>
        <div class="game-stats">
          <div class="stat">
            <span class="stat-icon">📝</span>
            <span class="stat-value">1000+ Questions</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🏆</span>
            <span class="stat-value">1000+ Achievements</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🔓</span>
            <span class="stat-value">Secret Codes</span>
          </div>
          <div class="stat">
            <span class="stat-icon">⚡</span>
            <span class="stat-value">Time Bombs</span>
          </div>
        </div>
        <div class="game-footer">
          <button class="play-btn">Play Now</button>
          <div class="difficulty">
            <span class="difficulty-label">Difficulty:</span>
            <div class="difficulty-bar">
              <div class="difficulty-fill impossible"></div>
            </div>
            <span class="difficulty-text">Impossible</span>
          </div>
        </div>
      </div>

      <div class="coming-soon-card">
        <div class="game-header">
          <div class="game-icon">🏛️</div>
          <div class="game-info">
            <h2 class="game-title">Congress Simulator</h2>
            <div class="game-badge coming-soon-badge">COMING SOON</div>
          </div>
        </div>
        <div class="game-description">
          <p>
            Experience the legislative process! Draft bills, debate in chambers, and try to get your
            laws passed.
          </p>
        </div>
        <div class="game-stats">
          <div class="stat">
            <span class="stat-icon">📜</span>
            <span class="stat-value">Bill Drafting</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🗳️</span>
            <span class="stat-value">Voting System</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🤝</span>
            <span class="stat-value">Negotiation</span>
          </div>
        </div>
        <div class="game-footer">
          <button class="play-btn disabled" disabled>Coming Soon</button>
          <div class="difficulty">
            <span class="difficulty-label">Difficulty:</span>
            <div class="difficulty-bar">
              <div class="difficulty-fill medium"></div>
            </div>
            <span class="difficulty-text">Medium</span>
          </div>
        </div>
      </div>

      <div class="coming-soon-card">
        <div class="game-header">
          <div class="game-icon">⚖️</div>
          <div class="game-info">
            <h2 class="game-title">Courtroom Drama</h2>
            <div class="game-badge coming-soon-badge">COMING SOON</div>
          </div>
        </div>
        <div class="game-description">
          <p>
            Step into the courtroom as a lawyer or judge. Present arguments, examine evidence, and
            deliver justice!
          </p>
        </div>
        <div class="game-stats">
          <div class="stat">
            <span class="stat-icon">👨‍⚖️</span>
            <span class="stat-value">Role Playing</span>
          </div>
          <div class="stat">
            <span class="stat-icon">📋</span>
            <span class="stat-value">Case Files</span>
          </div>
          <div class="stat">
            <span class="stat-icon">⚖️</span>
            <span class="stat-value">Verdicts</span>
          </div>
        </div>
        <div class="game-footer">
          <button class="play-btn disabled" disabled>Coming Soon</button>
          <div class="difficulty">
            <span class="difficulty-label">Difficulty:</span>
            <div class="difficulty-bar">
              <div class="difficulty-fill hard"></div>
            </div>
            <span class="difficulty-text">Hard</span>
          </div>
        </div>
      </div>

      <div class="coming-soon-card">
        <div class="game-header">
          <div class="game-icon">🗺️</div>
          <div class="game-info">
            <h2 class="game-title">nUSA Geography</h2>
            <div class="game-badge coming-soon-badge">COMING SOON</div>
          </div>
        </div>
        <div class="game-description">
          <p>
            Test your knowledge of nUSA geography, states, and landmarks in this educational
            adventure!
          </p>
        </div>
        <div class="game-stats">
          <div class="stat">
            <span class="stat-icon">📍</span>
            <span class="stat-value">Locations</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🏛️</span>
            <span class="stat-value">Landmarks</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🗺️</span>
            <span class="stat-value">Maps</span>
          </div>
        </div>
        <div class="game-footer">
          <button class="play-btn disabled" disabled>Coming Soon</button>
          <div class="difficulty">
            <span class="difficulty-label">Difficulty:</span>
            <div class="difficulty-bar">
              <div class="difficulty-fill easy"></div>
            </div>
            <span class="difficulty-text">Easy</span>
          </div>
        </div>
      </div>
    </div>

    <div class="leaderboard-section">
      <h2 class="section-title">🏆 Global Leaderboard</h2>
      <div class="leaderboard-tabs">
        <button
          v-for="tab in leaderboardTabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="leaderboard-content">
        <div v-if="activeTab === 'quiz'" class="leaderboard-table">
          <div class="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Score</span>
            <span>Questions</span>
            <span>Time</span>
          </div>
          <div v-for="(player, index) in mockLeaderboard" :key="index" class="table-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="player">{{ player.name }}</span>
            <span class="score">{{ player.score }}</span>
            <span class="questions">{{ player.questions }}</span>
            <span class="time">{{ player.time }}</span>
          </div>
        </div>
        <div v-else class="coming-soon-leaderboard">
          <p>
            Leaderboard for {{ leaderboardTabs.find(t => t.key === activeTab)?.label }} coming soon!
          </p>
        </div>
      </div>
    </div>

    <div class="achievements-showcase">
      <h2 class="section-title">🏅 Recent Achievements</h2>
      <div class="achievements-grid">
        <div
          v-for="achievement in recentAchievements"
          :key="achievement.id"
          class="achievement-card"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <h3 class="achievement-name">{{ achievement.name }}</h3>
            <p class="achievement-description">{{ achievement.description }}</p>
            <div class="achievement-meta">
              <span class="achievement-points">+{{ achievement.points }} pts</span>
              <span class="achievement-rarity" :class="achievement.rarity">
                {{ achievement.rarity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('quiz')

const leaderboardTabs = [
  { key: 'quiz', label: 'Impossible Quiz' },
  { key: 'congress', label: 'Congress Simulator' },
  { key: 'courtroom', label: 'Courtroom Drama' },
  { key: 'geography', label: 'nUSA Geography' }
]

const mockLeaderboard = [
  { name: 'QuizMaster2024', score: 9850, questions: 910, time: '45:23' },
  { name: 'ConstitutionKing', score: 9200, questions: 890, time: '52:17' },
  { name: 'LegalEagle', score: 8950, questions: 875, time: '48:45' },
  { name: 'GovGenius', score: 8700, questions: 860, time: '51:12' },
  { name: 'QuizChampion', score: 8450, questions: 845, time: '49:38' },
  { name: 'LawExpert', score: 8200, questions: 830, time: '53:27' },
  { name: 'SenatePro', score: 7950, questions: 815, time: '55:41' },
  { name: 'JudgeJudy', score: 7700, questions: 800, time: '47:19' },
  { name: 'BillMaster', score: 7450, questions: 785, time: '50:33' },
  { name: 'CivicHero', score: 7200, questions: 770, time: '52:08' }
]

const recentAchievements = [
  {
    id: 'platinum_completion',
    name: 'Platinum Scholar',
    description: 'Complete all 910 questions',
    icon: '💎',
    points: 1000,
    rarity: 'epic'
  },
  {
    id: 'konami_master',
    name: 'Code Breaker',
    description: 'Enter the Konami code',
    icon: '🎮',
    points: 500,
    rarity: 'mythic'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete quiz in under 10 minutes',
    icon: '⚡',
    points: 300,
    rarity: 'epic'
  },
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Complete quiz without losing a life',
    icon: '🛡️',
    points: 750,
    rarity: 'legendary'
  },
  {
    id: 'combo_legend',
    name: 'Combo Legend',
    description: 'Answer 25 questions correctly in a row',
    icon: '⚡',
    points: 500,
    rarity: 'legendary'
  },
  {
    id: 'ultimate_collector',
    name: 'Ultimate Collector',
    description: 'Unlock 1000 achievements',
    icon: '💎',
    points: 2000,
    rarity: 'mythic'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.games-hub {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #e0e0e0;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.hub-header {
  text-align: center;
  margin-bottom: 3rem;
}

.hub-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #4caf50, #2196f3, #9c27b0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hub-subtitle {
  font-size: 1.2rem;
  color: #9ca3af;
  max-width: 600px;
  margin: 0 auto;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.game-card,
.coming-soon-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: #4caf50;
}

.coming-soon-card {
  opacity: 0.7;
  cursor: not-allowed;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.game-icon {
  font-size: 3rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4caf50, #2196f3);
  border-radius: 50%;
}

.game-info {
  flex: 1;
}

.game-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.game-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.featured-badge {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  color: white;
}

.coming-soon-badge {
  background: #666;
  color: #ccc;
}

.game-description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #b0b0b0;
}

.game-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #9ca3af;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  font-weight: 500;
}

.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.play-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #4caf50, #45a049);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn:hover:not(.disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.play-btn.disabled {
  background: #666;
  cursor: not-allowed;
  opacity: 0.5;
}

.difficulty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.difficulty-label {
  color: #9ca3af;
}

.difficulty-bar {
  width: 60px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.difficulty-fill {
  height: 100%;
  border-radius: 3px;
}

.difficulty-fill.easy {
  width: 25%;
  background: #4caf50;
}
.difficulty-fill.medium {
  width: 50%;
  background: #ff9800;
}
.difficulty-fill.hard {
  width: 75%;
  background: #f44336;
}
.difficulty-fill.impossible {
  width: 100%;
  background: #9c27b0;
}

.difficulty-text {
  font-weight: 600;
  text-transform: uppercase;
}

.leaderboard-section,
.achievements-showcase {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.leaderboard-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: linear-gradient(45deg, #4caf50, #2196f3);
  color: white;
  border-color: transparent;
}

.tab-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.2);
}

.leaderboard-table {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px 80px;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px 80px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-row:last-child {
  border-bottom: none;
}

.rank {
  font-weight: 600;
  color: #4caf50;
}

.player {
  font-weight: 500;
}

.score,
.questions,
.time {
  text-align: right;
  font-family: 'Courier New', monospace;
}

.coming-soon-leaderboard {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.achievement-icon {
  font-size: 2.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4caf50, #2196f3);
  border-radius: 50%;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.achievement-description {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-bottom: 0.5rem;
}

.achievement-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-points {
  font-weight: 600;
  color: #4caf50;
}

.achievement-rarity {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.achievement-rarity.common {
  background: #666;
}
.achievement-rarity.uncommon {
  background: #4caf50;
}
.achievement-rarity.rare {
  background: #2196f3;
}
.achievement-rarity.epic {
  background: #9c27b0;
}
.achievement-rarity.legendary {
  background: #ff9800;
}
.achievement-rarity.mythic {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

@media (max-width: 768px) {
  .games-hub {
    padding: 1rem;
  }

  .hub-title {
    font-size: 2rem;
  }

  .games-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .game-stats {
    grid-template-columns: 1fr;
  }

  .game-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .leaderboard-tabs {
    flex-wrap: wrap;
  }

  .table-header,
  .table-row {
    grid-template-columns: 40px 1fr 60px 60px;
    font-size: 0.9rem;
  }

  .table-header span:last-child,
  .table-row span:last-child {
    display: none;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
