<template>
  <div class="game-page">
    <div v-if="!gameStarted" id="main-menu">
      <h1 class="game-title">
        The Impossible
        <br />
        nUSA Quiz
      </h1>
      <div class="menu-stats">
        <p>🎯 110 Questions</p>
        <p>🏆 1000+ Achievements</p>
        <p>🔓 Secret Codes</p>
        <p>⚡ Time Bombs</p>
      </div>
      <button
        id="start-btn"
        @click="startGame"
        @keydown.enter="startGame"
        @keydown.space="startGame"
        aria-label="Start the quiz game"
      >
        Start the Quiz!
      </button>
      <div class="menu-warnings">
        <p>⚠️ This quiz contains trick questions</p>
        <p>⚠️ Some answers may not be what they seem</p>
        <p>⚠️ Secret codes are hidden throughout</p>
      </div>
    </div>

    <div v-else id="game-container">
      <div id="game-header">
        <div id="lives">
          <div v-for="(life, index) in Math.max(0, currentLives)" :key="index" class="life"></div>
        </div>
        <div id="skips">
          <div v-for="(skip, index) in Math.max(0, skipsRemaining)" :key="index" class="skip">
            SKIP
          </div>
        </div>
        <div
          id="timer"
          v-if="currentQuestionData?.timeBomb"
          :class="{ 'time-bomb': timeRemaining <= 3000 }"
        >
          {{ Math.ceil(timeRemaining / 1000) }}s
        </div>
      </div>

      <div id="progress-bar">
        <div id="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>

      <div v-if="!gameEnded && currentQuestionData" id="question-container">
        <div id="question" :class="{ 'fourth-wall': currentQuestionData.fourthWall }">
          {{ deobfuscateText(currentQuestionData.text, currentQuestionData._questionId) }}
        </div>

        <div v-if="currentQuestionData.hints && currentQuestionData.hints.length > 0" id="hints">
          <div v-for="(hint, index) in currentQuestionData.hints" :key="index" class="hint">
            💡 {{ deobfuscateText(hint, currentQuestionData._questionId) }}
          </div>
        </div>

        <div id="answer-container">
          <template v-if="currentQuestionData.type === 'multiple-choice'">
            <button
              v-for="(option, index) in currentQuestionData.options"
              :key="index"
              class="answer-btn"
              :class="{
                'move-button': currentQuestionData.moveButton && shouldMoveButton(index),
                'wrong-answer': wrongAnswers.has(index)
              }"
              :style="
                currentQuestionData.moveButton && shouldMoveButton(index) ? getButtonPosition() : {}
              "
              @click="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              @keydown.enter="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              @keydown.space="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              :aria-label="`Select answer: ${deobfuscateText(option, currentQuestionData._questionId)}`"
            >
              {{ deobfuscateText(option, currentQuestionData._questionId) }}
            </button>
          </template>

          <template v-if="currentQuestionData.type === 'text-input'">
            <label for="answer-input" class="sr-only">Your answer</label>
            <input
              v-model="textAnswer"
              type="text"
              id="answer-input"
              placeholder="Type your answer..."
              @keyup.enter="checkAnswer(textAnswer)"
              aria-label="Answer input"
            />
            <button
              id="submit-btn"
              @click="checkAnswer(textAnswer)"
              @keydown.enter="checkAnswer(textAnswer)"
              @keydown.space="checkAnswer(textAnswer)"
              aria-label="Submit your answer"
            >
              Submit
            </button>
          </template>

          <template v-if="currentQuestionData.type === 'click-target'">
            <div id="click-area" @click="handleClickArea">
              <span
                v-for="(word, index) in getClickableWords()"
                :key="index"
                class="clickable-word"
                @click.stop="checkAnswer(word)"
              >
                {{ word }}
              </span>
            </div>
          </template>

          <template v-if="currentQuestionData.type === 'trick'">
            <button
              v-for="(option, index) in currentQuestionData.options"
              :key="index"
              class="answer-btn trick-btn"
              @click="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              @keydown.enter="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              @keydown.space="checkAnswer(deobfuscateText(option, currentQuestionData._questionId))"
              :aria-label="`Select answer: ${deobfuscateText(option, currentQuestionData._questionId)}`"
            >
              {{ deobfuscateText(option, currentQuestionData._questionId) }}
            </button>
          </template>

          <template v-if="currentQuestionData.type === 'secret'">
            <label for="secret-input" class="sr-only">Enter secret code</label>
            <input
              v-model="secretAnswer"
              type="text"
              id="secret-input"
              placeholder="Enter secret code..."
              @keyup.enter="checkAnswer(secretAnswer)"
              aria-label="Secret code input"
            />
            <button
              id="secret-submit-btn"
              @click="checkAnswer(secretAnswer)"
              @keydown.enter="checkAnswer(secretAnswer)"
              @keydown.space="checkAnswer(secretAnswer)"
              aria-label="Submit secret code"
            >
              Submit
            </button>
          </template>
        </div>

        <button
          v-if="skipsRemaining > 0"
          id="skip-btn"
          @click="skipQuestion"
          @keydown.enter="skipQuestion"
          @keydown.space="skipQuestion"
          aria-label="Skip this question"
        >
          Skip Question ({{ skipsRemaining }} left)
        </button>
      </div>

      <div v-if="isGameOver" class="game-over">
        <h2>Game Over!</h2>
        <p>You reached question {{ currentQuestionIndex + 1 }}</p>
        <p>Questions answered: {{ questionsAnswered }}</p>
        <div class="achievements-summary">
          <h3>Achievements Unlocked:</h3>
          <div class="achievement-list">
            <div
              v-for="achievement in unlockedAchievements"
              :key="achievement.id"
              class="achievement-item"
            >
              <span class="achievement-icon">{{ achievement.icon }}</span>
              <span class="achievement-name">{{ achievement.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isVictory" class="victory">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You completed The Impossible nUSA Quiz!</p>
        <p>Final Score: {{ currentLives }} lives remaining</p>
        <p>Time: {{ formatTime(totalTime) }}</p>
        <div class="achievements-summary">
          <h3>All Achievements Unlocked!</h3>
          <div class="achievement-list">
            <div
              v-for="achievement in unlockedAchievements"
              :key="achievement.id"
              class="achievement-item"
            >
              <span class="achievement-icon">{{ achievement.icon }}</span>
              <span class="achievement-name">{{ achievement.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="gameEnded"
        class="restart-btn"
        @click="restartGame"
        @keydown.enter="restartGame"
        @keydown.space="restartGame"
        aria-label="Play the quiz again"
      >
        Play Again
      </button>
    </div>

    <!-- Secret Achievement Modal -->
    <div v-if="showAchievementModal" class="achievement-modal" @click="closeAchievementModal">
      <div class="achievement-content" @click.stop>
        <h3>🏆 Achievement Unlocked!</h3>
        <div class="achievement-display">
          <span class="achievement-icon-large">{{ currentAchievement?.icon }}</span>
          <h4>{{ currentAchievement?.name }}</h4>
          <p>{{ currentAchievement?.description }}</p>
          <div class="achievement-points">+{{ currentAchievement?.points }} points</div>
        </div>
        <button @click="closeAchievementModal">Continue</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface QuizQuestion {
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
  question: string
  text?: string
  options?: string[]
  difficulty: string
  category: string
  hints?: string[]
  timeBomb?: boolean
  movingButton?: boolean
  moveButton?: boolean
  fourthWall?: boolean
  trickQuestion?: boolean
  _questionId?: number // For client-side deobfuscation
}

interface QuestionsResponse {
  success: boolean
  questions: QuizQuestion[]
  sessionToken: string
}

interface ValidateAnswerResponse {
  success: boolean
  correct: boolean
  sessionToken: string
  secret?: boolean
  secretQuestion?: QuizQuestion
  timeBombExploded?: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  category: string
  rarity: string
  icon: string
  points: number
  secret?: boolean
}

// Game state
const gameStarted = ref(false)
const currentLives = ref(3)
const skipsRemaining = ref(3)
const currentQuestionIndex = ref(0)
const textAnswer = ref('')
const secretAnswer = ref('')
const isGameOver = ref(false)
const isVictory = ref(false)
const questions = ref<QuizQuestion[]>([])
const currentQuestionData = ref<QuizQuestion | null>(null)
const sessionToken = ref('')
const questionStartTime = ref(0)
const totalTime = ref(0)
const timeRemaining = ref(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)
const wrongAnswers = ref(new Set<number>())
const questionsAnswered = ref(0)
const answerHistory = ref<number[]>([])

// Achievement state
const unlockedAchievements = ref<Achievement[]>([])
const showAchievementModal = ref(false)
const currentAchievement = ref<Achievement | null>(null)

// Konami code tracking
const konamiCode = ref([
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
])
const konamiIndex = ref(0)

// Computed properties
const progressPercentage = computed(() => {
  return questions.value.length > 0
    ? ((currentQuestionIndex.value + 1) / questions.value.length) * 100
    : 0
})

const gameEnded = computed(() => isGameOver.value || isVictory.value)

// Initialize game
onMounted(async () => {
  await initializeGame()
  setupKeyboardListeners()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  removeKeyboardListeners()
})

const initializeGame = async () => {
  try {
    // Generate initial session token
    sessionToken.value = generateSessionToken()

    // Load first batch of questions
    await loadQuestions()
  } catch (error) {
    console.error('Failed to initialize game:', error)
  }
}

const generateSessionToken = (): string => {
  const timestamp = Date.now().toString()
  // Start with a simple token - server will validate and generate proper one
  return `${timestamp}:initial`
}

const loadQuestions = async () => {
  try {
    const response = (await $fetch('/api/quiz/questions', {
      method: 'GET',
      query: {
        count: 110,
        sessionToken: sessionToken.value
      }
    })) as QuestionsResponse

    if (response.success) {
      questions.value = response.questions
      sessionToken.value = response.sessionToken
      currentQuestionData.value = questions.value[0] || null
    }
  } catch (error) {
    console.error('Failed to load questions:', error)
  }
}

const startGame = () => {
  gameStarted.value = true
  currentLives.value = 3
  skipsRemaining.value = 3
  currentQuestionIndex.value = 0
  questionsAnswered.value = 0
  answerHistory.value = []
  wrongAnswers.value.clear()
  isGameOver.value = false
  isVictory.value = false
  totalTime.value = 0
  startQuestionTimer()
}

const startQuestionTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }

  questionStartTime.value = Date.now()

  if (currentQuestionData.value?.timeBomb) {
    timeRemaining.value = 10000 // 10 seconds
    timerInterval.value = setInterval(() => {
      timeRemaining.value -= 100
      if (timeRemaining.value <= 0) {
        handleTimeBombExploded()
      }
    }, 100)
  }
}

const handleTimeBombExploded = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  loseLife()
  nextQuestion()
}

const checkAnswer = async (answer: string) => {
  if (!currentQuestionData.value) return

  const timeSpent = Date.now() - questionStartTime.value

  try {
    // Get authorization token for quiz validation
    const tokenResponse = (await $fetch('/api/auth/token', {
      method: 'POST',
      body: { endpoint: 'quiz/validate-answer' }
    })) as { token: string }

    const response = (await $fetch('/api/quiz/validate-answer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenResponse.token}`
      },
      body: {
        questionId: currentQuestionData.value.id,
        answer,
        sessionToken: sessionToken.value,
        timeSpent,
        skipUsed: false
      }
    })) as ValidateAnswerResponse

    if (response.success) {
      sessionToken.value = response.sessionToken

      if (response.secret) {
        // Secret code discovered!
        showSecretQuestion(response.secretQuestion)
        return
      }

      if (response.correct) {
        questionsAnswered.value++
        answerHistory.value.push(currentQuestionData.value.id)
        checkForAchievements()
        createParticles(window.innerWidth / 2, window.innerHeight / 2)
        nextQuestion()
      } else {
        if (response.timeBombExploded) {
          loseLife()
          nextQuestion()
        } else {
          shakeScreen()
          if (currentQuestionData.value.type === 'multiple-choice') {
            const wrongIndex = currentQuestionData.value.options?.indexOf(answer) ?? -1
            if (wrongIndex >= 0) {
              wrongAnswers.value.add(wrongIndex)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to validate answer:', error)
  }
}

const showSecretQuestion = (secretQuestion: QuizQuestion) => {
  currentQuestionData.value = secretQuestion
  wrongAnswers.value.clear()
  startQuestionTimer()
}

const skipQuestion = () => {
  if (skipsRemaining.value > 0) {
    skipsRemaining.value--
    nextQuestion()
  }
}

const nextQuestion = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }

  wrongAnswers.value.clear()

  if (currentQuestionIndex.value >= questions.value.length - 1) {
    isVictory.value = true
    totalTime.value = Date.now() - questionStartTime.value
    checkForFinalAchievements()
  } else {
    currentQuestionIndex.value++
    currentQuestionData.value = questions.value[currentQuestionIndex.value]
    startQuestionTimer()
  }
}

const loseLife = () => {
  currentLives.value--
  if (currentLives.value <= 0) {
    isGameOver.value = true
    totalTime.value = Date.now() - questionStartTime.value
  }
}

const restartGame = () => {
  gameStarted.value = false
  currentLives.value = 3
  skipsRemaining.value = 3
  currentQuestionIndex.value = 0
  textAnswer.value = ''
  secretAnswer.value = ''
  isGameOver.value = false
  isVictory.value = false
  questionsAnswered.value = 0
  answerHistory.value = []
  wrongAnswers.value.clear()
  unlockedAchievements.value = []
  loadQuestions()
}

// Helper functions
const deobfuscateText = (text: string, questionId?: number): string => {
  if (!sessionToken.value) {
    return text
  }

  // Use the same logic as server: questionId + sessionToken.charCodeAt(0)
  const actualQuestionId = questionId || 1 // Fallback to 1 if not provided
  const seed = actualQuestionId + sessionToken.value.charCodeAt(0)

  const result = text
    .split('')
    .map((char, index) => {
      const code = char.charCodeAt(0)
      const deobfuscated = code ^ ((seed + index) % 256)
      return String.fromCharCode(deobfuscated)
    })
    .join('')

  // Check if result contains valid readable characters
  const readableChars = result.match(/[a-zA-Z0-9\s.,!?()-]/g)?.length || 0
  const totalChars = result.length

  if (readableChars < totalChars * 0.7) {
    return text
  }

  return result
}

const shouldMoveButton = (index: number): boolean => {
  return currentQuestionData.value?.moveButton && index === 0
}

const getButtonPosition = (): { left: string; top: string } => {
  const x = Math.random() * 200 - 100
  const y = Math.random() * 100 - 50
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`
  }
}

const getClickableWords = (): string[] => {
  if (!currentQuestionData.value?.text) return []
  return currentQuestionData.value.text.split(' ')
}

const handleClickArea = (event: MouseEvent) => {
  // Handle click target questions
  const target = event.target as HTMLElement
  if (target.classList.contains('clickable-word')) {
    checkAnswer(target.textContent || '')
  }
}

const createParticles = (x: number, y: number) => {
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = x + 'px'
  container.style.top = y + 'px'
  container.style.pointerEvents = 'none'
  document.body.appendChild(container)

  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div')
    particle.style.position = 'absolute'
    particle.style.width = '4px'
    particle.style.height = '4px'
    particle.style.backgroundColor = '#4caf50'
    particle.style.borderRadius = '50%'
    const angle = (i / 8) * Math.PI * 2
    const px = Math.cos(angle) * 50
    const py = Math.sin(angle) * 50
    particle.style.setProperty('--x', px + 'px')
    particle.style.setProperty('--y', py + 'px')
    particle.style.animation = 'particle 0.5s ease-out forwards'
    container.appendChild(particle)
  }

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }, 1000)
}

const shakeScreen = () => {
  const gameContainer = document.getElementById('game-container')
  if (gameContainer) {
    gameContainer.classList.add('shake')
    setTimeout(() => {
      gameContainer.classList.remove('shake')
    }, 500)
  }
}

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Achievement system
const checkForAchievements = () => {
  // Check for various achievements based on progress
  if (questionsAnswered.value === 25) {
    unlockAchievement({
      id: 'bronze_completion',
      name: 'Bronze Scholar',
      description: 'Complete 25 questions',
      category: 'progress',
      rarity: 'common',
      icon: '🥉',
      points: 100
    })
  }

  if (questionsAnswered.value === 50) {
    unlockAchievement({
      id: 'silver_completion',
      name: 'Silver Scholar',
      description: 'Complete 50 questions',
      category: 'progress',
      rarity: 'uncommon',
      icon: '🥈',
      points: 250
    })
  }

  if (questionsAnswered.value === 75) {
    unlockAchievement({
      id: 'gold_completion',
      name: 'Gold Scholar',
      description: 'Complete 75 questions',
      category: 'progress',
      rarity: 'rare',
      icon: '🥇',
      points: 500
    })
  }
}

const checkForFinalAchievements = () => {
  if (isVictory.value) {
    unlockAchievement({
      id: 'platinum_completion',
      name: 'Platinum Scholar',
      description: 'Complete all 110 questions',
      category: 'progress',
      rarity: 'epic',
      icon: '💎',
      points: 1000
    })
  }
}

const unlockAchievement = (achievement: Achievement) => {
  if (!unlockedAchievements.value.find(a => a.id === achievement.id)) {
    unlockedAchievements.value.push(achievement)
    currentAchievement.value = achievement
    showAchievementModal.value = true
  }
}

const closeAchievementModal = () => {
  showAchievementModal.value = false
  currentAchievement.value = null
}

// Keyboard listeners for Konami code
const setupKeyboardListeners = () => {
  window.addEventListener('keydown', handleKeyDown)
}

const removeKeyboardListeners = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Check for Konami code
  if (event.key === konamiCode.value[konamiIndex.value]) {
    konamiIndex.value++
    if (konamiIndex.value === konamiCode.value.length) {
      // Konami code entered!
      checkAnswer('↑↑↓↓←→←→BA')
      konamiIndex.value = 0
    }
  } else {
    konamiIndex.value = 0
  }
}
</script>

<style scoped>
.game-page {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  background-image: linear-gradient(
    45deg,
    #1a1a1a 25%,
    #222 25%,
    #222 50%,
    #1a1a1a 50%,
    #1a1a1a 75%,
    #222 75%,
    #222 100%
  );
  background-size: 40px 40px;
  color: white;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#main-menu {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  max-width: 500px;
}

.menu-stats {
  margin: 20px 0;
  font-size: 1.2rem;
  color: #4caf50;
}

.menu-stats p {
  margin: 5px 0;
}

.menu-warnings {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #ff9800;
}

.menu-warnings p {
  margin: 3px 0;
}

.game-title {
  font-size: 48px;
  margin-bottom: 30px;
  text-shadow: 3px 3px 0 #000;
  animation: rainbow 6s linear infinite;
}

#start-btn {
  font-size: 24px;
  padding: 15px 30px;
  background-color: #4caf50;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.3s;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  box-shadow: 0 5px 0 #45a049;
}

#start-btn:hover {
  transform: scale(1.1);
  background-color: #45a049;
}

#game-container {
  max-width: 90vw;
  width: 100%;
  text-align: center;
  padding: 20px;
}

#game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}

#lives,
#skips {
  display: flex;
  gap: 5px;
}

.life,
.skip {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
}

.life {
  background-color: #ff4444;
  border: 2px solid #fff;
}

.skip {
  background-color: #ff9800;
  border: 2px solid #fff;
  font-size: 8px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  font-weight: bold;
}

#timer {
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
}

#timer.time-bomb {
  color: #ff4444;
  animation: pulse 0.5s infinite;
}

#progress-bar {
  width: 100%;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
}

#progress {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}

#question-container {
  background-color: rgba(0, 0, 0, 0.8);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 20px;
  min-height: 200px;
}

#question {
  font-size: 1.5rem;
  margin-bottom: 20px;
  line-height: 1.4;
}

#question.fourth-wall {
  color: #ff9800;
  font-style: italic;
}

#hints {
  margin: 15px 0;
}

.hint {
  background-color: rgba(255, 152, 0, 0.2);
  border: 1px solid #ff9800;
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0;
  font-size: 0.9rem;
}

#answer-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.answer-btn {
  font-size: 1.1rem;
  padding: 15px 25px;
  background-color: #2196f3;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
  position: relative;
}

.answer-btn:hover {
  transform: scale(1.05);
  background-color: #1976d2;
}

.answer-btn.move-button {
  position: absolute;
  animation: moveButton 2s infinite;
}

.answer-btn.wrong-answer {
  background-color: #ff4444;
  pointer-events: none;
}

.trick-btn {
  background-color: #9c27b0;
}

.trick-btn:hover {
  background-color: #7b1fa2;
}

#answer-input,
#secret-input {
  font-size: 1.1rem;
  padding: 15px;
  border: 2px solid #2196f3;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  min-width: 300px;
}

#submit-btn,
#secret-submit-btn {
  font-size: 1.1rem;
  padding: 15px 25px;
  background-color: #4caf50;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

#submit-btn:hover,
#secret-submit-btn:hover {
  background-color: #45a049;
}

#click-area {
  font-size: 1.3rem;
  line-height: 2;
  cursor: pointer;
}

.clickable-word {
  padding: 5px;
  margin: 0 2px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.clickable-word:hover {
  background-color: rgba(33, 150, 243, 0.3);
}

#skip-btn {
  font-size: 1rem;
  padding: 10px 20px;
  background-color: #ff9800;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

#skip-btn:hover {
  background-color: #f57c00;
}

.game-over,
.victory {
  text-align: center;
  padding: 30px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  margin: 20px 0;
}

.game-over h2 {
  color: #ff4444;
  font-size: 2rem;
  margin-bottom: 15px;
}

.victory h2 {
  color: #4caf50;
  font-size: 2rem;
  margin-bottom: 15px;
}

.achievements-summary {
  margin: 20px 0;
  padding: 15px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.achievement-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.achievement-icon {
  font-size: 1.2rem;
}

.restart-btn {
  font-size: 1.2rem;
  padding: 15px 30px;
  background-color: #2196f3;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 20px 0;
}

.restart-btn:hover {
  background-color: #1976d2;
  transform: scale(1.05);
}

.achievement-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.achievement-content {
  background: linear-gradient(135deg, #2196f3, #4caf50);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  max-width: 400px;
  color: white;
}

.achievement-icon-large {
  font-size: 4rem;
  display: block;
  margin-bottom: 15px;
}

.achievement-display h4 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.achievement-display p {
  margin-bottom: 15px;
  opacity: 0.9;
}

.achievement-points {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffeb3b;
  margin-bottom: 20px;
}

.achievement-content button {
  background-color: white;
  color: #2196f3;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.achievement-content button:hover {
  background-color: #f5f5f5;
}

/* Animations */
@keyframes rainbow {
  0% {
    color: #ff0000;
  }
  17% {
    color: #ff8800;
  }
  33% {
    color: #ffff00;
  }
  50% {
    color: #00ff00;
  }
  67% {
    color: #0088ff;
  }
  83% {
    color: #8800ff;
  }
  100% {
    color: #ff0000;
  }
}

@keyframes particle {
  to {
    transform: translate(var(--x), var(--y));
    opacity: 0;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes moveButton {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(50px, 20px);
  }
  50% {
    transform: translate(-30px, 40px);
  }
  75% {
    transform: translate(20px, -20px);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  #game-container {
    padding: 10px;
  }

  #question {
    font-size: 1.2rem;
  }

  .answer-btn {
    font-size: 1rem;
    padding: 12px 20px;
    min-width: 150px;
  }

  #answer-input,
  #secret-input {
    min-width: 250px;
    font-size: 1rem;
  }

  .game-title {
    font-size: 36px;
  }

  #main-menu {
    padding: 15px;
    margin: 10px;
  }
}
</style>
