<template>
  <div class="game-page">
    
    <div v-if="!gameStarted" id="main-menu">
      <h1 class="game-title">The Impossible<br>nUSA Quiz</h1>
      <button id="start-btn" @click="startGame">Start the Quiz!</button>
    </div>

    <div v-else id="game-container">
      <div id="lives">
        <div 
          v-for="(life, index) in currentLives" 
          :key="index" 
          class="life"
        ></div>
      </div>
      
      <div id="progress-bar">
        <div id="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      
      <div v-if="!gameEnded" id="question-container">
        <div id="question">{{ currentQuestionData?.text }}</div>
        <div id="answer-container">
          
          <template v-if="currentQuestionData?.type === 'multiple-choice'">
            <button 
              v-for="(option, index) in currentQuestionData.options" 
              :key="index"
              class="answer-btn"
              @click="checkAnswer(option)"
            >
              {{ option }}
            </button>
          </template>

          <template v-if="currentQuestionData?.type === 'text-input'">
            <input 
              v-model="textAnswer"
              type="text" 
              id="answer-input"
              @keyup.enter="checkAnswer(textAnswer)"
            />
            <button id="submit-btn" @click="checkAnswer(textAnswer)">Submit</button>
          </template>
        </div>
      </div>
      
      <div v-if="isGameOver" class="game-over">Game Over!</div>
      <div v-if="isVictory" class="victory">Congratulations! You've Won!</div>
      <button v-if="gameEnded" class="restart-btn" @click="restartGame">Play Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Question {
  type: 'multiple-choice' | 'text-input' | 'click-target'
  text: string
  options?: string[]
  answer: string
}

const gameStarted = ref(false)
const currentLives = ref(3)
const currentQuestionIndex = ref(0)
const textAnswer = ref('')
const isGameOver = ref(false)
const isVictory = ref(false)

const questions: Question[] = [
  {
    type: 'multiple-choice',
    text: 'What branch of government is established in Article I of the nUSA Constitution?',
    options: ['Legislative', 'Executive', 'Judicial', 'Municipal'],
    answer: 'Legislative'
  }
]

const currentQuestionData = computed(() => {
  return questions[currentQuestionIndex.value]
})

const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / questions.length) * 100
})

const gameEnded = computed(() => isGameOver.value || isVictory.value)

const startGame = () => {
  gameStarted.value = true
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
    particle.style.backgroundColor = 'red'
    particle.style.borderRadius = '50%'
    const angle = (i / 8) * Math.PI * 2
    const px = Math.cos(angle) * 50
    const py = Math.sin(angle) * 50
    particle.style.setProperty('--x', px + 'px')
    particle.style.setProperty('--y', py + 'px')
    particle.style.animation = 'particle 0.5s ease-out forwards'
    container.appendChild(particle)
  }

  setTimeout(() => document.body.removeChild(container), 1000)
}

const loseLife = (lifeElement: HTMLElement) => {
  document.body.style.animation = 'shake 0.5s'
  setTimeout(() => document.body.style.animation = '', 500)

  const rect = lifeElement.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  lifeElement.style.animation = 'explode 0.3s forwards'
  createParticles(centerX, centerY)
  setTimeout(() => lifeElement.remove(), 300)
}

const checkAnswer = (answer: string) => {
  const question = currentQuestionData.value
  if (!question) return
  
  if (answer.toLowerCase() === question.answer.toLowerCase()) {
    currentQuestionIndex.value++
    textAnswer.value = ''
    
    if (currentQuestionIndex.value >= questions.length) {
      isVictory.value = true
    }
  } else {
    const lifeElements = document.querySelectorAll('.life')
    if (lifeElements.length > 0) {
      loseLife(lifeElements[lifeElements.length - 1] as HTMLElement)
    }
    currentLives.value--
    
    if (currentLives.value <= 0) {
      setTimeout(() => {
        isGameOver.value = true
      }, 500)
    }
  }
}

const restartGame = () => {
  currentLives.value = 3
  currentQuestionIndex.value = 0
  textAnswer.value = ''
  isGameOver.value = false
  isVictory.value = false
}
</script>

<style>
@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-5px, -5px); }
  50% { transform: translate(5px, 5px); }
  75% { transform: translate(-5px, 5px); }
}

@keyframes explode {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  100% { 
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes particle {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) scale(0);
    opacity: 0;
  }
}

@keyframes rainbow {
  0% { color: #ff0000; }
  17% { color: #ff8000; }
  33% { color: #ffff00; }
  50% { color: #00ff00; }
  67% { color: #0080ff; }
  83% { color: #8000ff; }
  100% { color: #ff0000; }
}

.game-page {
  margin: 0;
  padding: 20px;
  background-color: #1a1a1a;
  background-image: linear-gradient(45deg, #1a1a1a 25%, #222 25%, #222 50%, #1a1a1a 50%, #1a1a1a 75%, #222 75%, #222 100%);
  background-size: 40px 40px;
  color: white;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#main-menu {
  text-align: center;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
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
  background-color: #4CAF50;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  box-shadow: 0 5px 0 #45a049;
}

#start-btn:hover {
  transform: scale(1.1);
  background-color: #45a049;
}

#game-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

#lives {
  margin-bottom: 20px;
}

.life {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: red;
  border-radius: 50%;
  margin: 0 5px;
}

#progress-bar {
  width: 100%;
  height: 20px;
  background-color: #333;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

#progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

#question-container {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}

#question {
  font-size: 24px;
  margin-bottom: 20px;
}

#answer-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-btn {
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.answer-btn:hover {
  background-color: #45a049;
}

#answer-input {
  padding: 10px;
  font-size: 18px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: none;
}

#submit-btn {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 5px;
}

.game-over, .victory {
  font-size: 36px;
  margin-bottom: 20px;
}

.game-over {
  color: red;
}

.victory {
  color: #4CAF50;
}

.restart-btn {
  padding: 15px 30px;
  font-size: 24px;
  cursor: pointer;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 5px;
}
</style>