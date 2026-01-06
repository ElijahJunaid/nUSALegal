

export interface ConversationalResult {
  isConversational: boolean
  confidence: number
  intent: 'greeting' | 'wellbeing' | 'gratitude' | 'farewell' | 'casual' | 'chitchat' | 'personal' | 'unknown'
  suggestedResponse?: string
}

const CONVERSATIONAL_PATTERNS = {
  greeting: [
    'hello', 'hi', 'hey', 'sup', "what's up", 'yo', 'hiya', 'greetings',
    'good morning', 'good afternoon', 'good evening', 'good day'
  ],
  wellbeing: [
    'how are you', "how's it going", "how are things", 'you good', 'you ok',
    "how've you been", 'how do you do', 'how r you', 'hru', 'how u doing'
  ],
  gratitude: [
    'thanks', 'thank you', 'thx', 'ty', 'tysm', 'appreciate it',
    'thanks a lot', 'thank you so much', 'cheers'
  ],
  farewell: [
    'bye', 'goodbye', 'see you', 'later', 'see ya', 'peace', 'cya',
    'take care', 'have a good day', 'catch you later', 'gotta go'
  ],
  casual: [
    'lol', 'lmao', 'haha', 'hehe', 'cool', 'nice', 'awesome', 'great',
    'wow', 'omg', 'nah', 'yup', 'yep', 'yeah', 'nope', 'k', 'ok', 'okay'
  ],
  chitchat: [
    "what's your name", 'who are you', 'where are you from', 'tell me about yourself',
    'are you a bot', 'are you human', 'are you real', 'can you hear me',
    'do you understand', 'do you know', 'what can you do'
  ],
  personal: [
    'do you like', 'have you ever', 'can you tell me', "what's your favorite",
    'which is better', 'what do you think', 'your opinion', 'how do you feel'
  ]
}

const RESPONSE_TEMPLATES: Record<string, string[]> = {
  greeting: [
    "Hello! I'm CaseBot, your legal assistant. What legal question can I help you with?",
    "Hi there! I'm here to help with legal questions. What would you like to know?",
    "Hey! Ready to assist with your legal questions. What can I help you with?"
  ],
  wellbeing: [
    "I'm doing great, thanks for asking! I'm here to help with legal questions. What can I assist you with today?",
    "I'm doing well! Ready to help you with any legal questions you have.",
    "I'm functioning perfectly and ready to help with legal matters!"
  ],
  gratitude: [
    "You're welcome! Let me know if you have any other legal questions.",
    "Happy to help! Feel free to ask if you need more legal assistance.",
    "You're very welcome! I'm here whenever you need legal guidance."
  ],
  farewell: [
    "Goodbye! Come back anytime you need legal assistance.",
    "Take care! Feel free to return if you have more legal questions.",
    "See you later! I'm here whenever you need legal help."
  ],
  casual: [
    "I appreciate your enthusiasm! How can I help you with legal matters today?",
    "Let me know what legal questions you have!",
    "Ready to assist with your legal questions!"
  ],
  chitchat: [
    "I'm CaseBot, an AI legal assistant! I'm here to help answer questions about laws, statutes, and legal procedures. What would you like to know?",
    "I specialize in legal matters! How can I assist you with laws, regulations, or legal questions today?"
  ],
  personal: [
    "As a legal assistant, I focus on providing legal information rather than personal opinions. What legal question can I help you with?",
    "I'm here to help with legal matters! What specific legal question do you have?"
  ]
}

function analyzeSentenceStructure(text: string): {
  isQuestion: boolean
  startsWithYou: boolean
  containsPersonalOpinion: boolean
  isShort: boolean
  hasEmojis: boolean
  hasExcessivePunctuation: boolean
} {
  const lower = text.toLowerCase()
  
  return {
    isQuestion: /\?$/.test(text) || /^(what|where|when|who|why|how|can|could|should|would|is|are|do|does)/i.test(text),
    startsWithYou: /^you\b/i.test(text),
    containsPersonalOpinion: /\b(i feel|i think|in my opinion|i believe)\b/i.test(lower),
    isShort: text.split(/\s+/).length <= 5,
    hasEmojis: /[\u{1F300}-\u{1F9FF}]/u.test(text),
    hasExcessivePunctuation: /[!?]{2,}/.test(text)
  }
}

function calculateConversationalDensity(text: string): number {
  const words = text.toLowerCase().split(/\s+/)
  const totalWords = words.length
  
  if (totalWords === 0) return 0
  
  let conversationalCount = 0

  for (const patterns of Object.values(CONVERSATIONAL_PATTERNS)) {
    for (const pattern of patterns) {
      const patternWords = pattern.split(/\s+/)
      const patternText = patternWords.join(' ')
      
      if (text.toLowerCase().includes(patternText)) {
        conversationalCount += patternWords.length
      }
    }
  }
  
  return conversationalCount / totalWords
}

function classifyIntent(text: string): ConversationalResult['intent'] {
  const lower = text.toLowerCase().trim()

  for (const [intent, patterns] of Object.entries(CONVERSATIONAL_PATTERNS)) {
    for (const pattern of patterns) {
      if (lower === pattern || lower === pattern + '?' || lower === pattern + '!' || 
          lower.startsWith(pattern + ' ') || lower.includes(' ' + pattern + ' ') ||
          lower.endsWith(' ' + pattern)) {
        return intent as ConversationalResult['intent']
      }
    }
  }
  
  return 'unknown'
}

function calculateLevenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length
  const len2 = str2.length
  const matrix: number[][] = []
  
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[len2][len1]
}

function findClosestMatch(text: string): { intent: ConversationalResult['intent']; similarity: number } {
  const lower = text.toLowerCase().trim()
  let bestMatch: ConversationalResult['intent'] = 'unknown'
  let bestSimilarity = 0
  
  for (const [intent, patterns] of Object.entries(CONVERSATIONAL_PATTERNS)) {
    for (const pattern of patterns) {
      const distance = calculateLevenshteinDistance(lower, pattern)
      const maxLen = Math.max(lower.length, pattern.length)
      const similarity = 1 - (distance / maxLen)
      
      if (similarity > bestSimilarity && similarity > 0.7) {
        bestSimilarity = similarity
        bestMatch = intent as ConversationalResult['intent']
      }
    }
  }
  
  return { intent: bestMatch, similarity: bestSimilarity }
}

export function detectConversational(text: string): ConversationalResult {
  const trimmed = text.trim()

  if (trimmed.split(/\s+/).length > 30) {
    return {
      isConversational: false,
      confidence: 0,
      intent: 'unknown'
    }
  }

  const intent = classifyIntent(trimmed)
  if (intent !== 'unknown') {
    const templates = RESPONSE_TEMPLATES[intent]
    const response = templates[Math.floor(Math.random() * templates.length)]
    
    return {
      isConversational: true,
      confidence: 0.95,
      intent,
      suggestedResponse: response
    }
  }

  const structure = analyzeSentenceStructure(trimmed)
  let structureScore = 0
  
  if (structure.startsWithYou) structureScore += 0.3
  if (structure.containsPersonalOpinion) structureScore += 0.2
  if (structure.isShort && !structure.isQuestion) structureScore += 0.2
  if (structure.hasEmojis) structureScore += 0.2
  if (structure.hasExcessivePunctuation) structureScore += 0.1

  const density = calculateConversationalDensity(trimmed)

  const { intent: similarIntent, similarity } = findClosestMatch(trimmed)

  const combinedScore = Math.max(
    structureScore,
    density,
    similarity * 0.8
  )
  
  const isConversational = combinedScore > 0.5
  const finalIntent = similarIntent !== 'unknown' ? similarIntent : intent
  
  let suggestedResponse: string | undefined
  if (isConversational && finalIntent !== 'unknown') {
    const templates = RESPONSE_TEMPLATES[finalIntent] || RESPONSE_TEMPLATES.casual
    suggestedResponse = templates[Math.floor(Math.random() * templates.length)]
  }
  
  return {
    isConversational,
    confidence: combinedScore,
    intent: finalIntent,
    suggestedResponse
  }
}

export interface MLModelHook {
  predict: (text: string) => Promise<{ intent: string; confidence: number }>
}

let mlModel: MLModelHook | null = null

export function registerMLModel(model: MLModelHook): void {
  mlModel = model
}

export async function detectWithML(text: string): Promise<ConversationalResult> {
  if (!mlModel) {
    return detectConversational(text)
  }
  
  try {
    const prediction = await mlModel.predict(text)
    
    return {
      isConversational: prediction.intent === 'conversational',
      confidence: prediction.confidence,
      intent: prediction.intent as ConversationalResult['intent'],
      suggestedResponse: prediction.intent === 'conversational' 
        ? "I'm here to help with legal questions! What would you like to know?"
        : undefined
    }
  } catch (error) {
    
    return detectConversational(text)
  }
}
