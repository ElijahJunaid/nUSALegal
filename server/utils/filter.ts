

const MAX_QUERY_LENGTH = 500
const MIN_QUERY_LENGTH = 3

const MALICIOUS_PATTERNS = [
  /<script\b[^>]*>(.*?)<\/script>/gi,
  /<[^>]+>/gi,
  /\b(on\w+|javascript:).*?[=;]/gi,
  /\b(eval|alert|prompt|confirm)\(.*?\)/gi,
]

const KEYWORD_SCORES: Record<string, number> = {

  'hack': -100,
  'exploit': -100,
  'bypass': -100,
  'crack': -100,
  'joke': -50,
  'funny': -50,
  'lol': -50,
  'haha': -50,
  'laugh': -50,

  'crush': -40,
  'kiss': -40,
  'hug': -40,
  'flirt': -40,
  'dating': -40,
  'sex': -40,
  'boyfriend': -40,
  'girlfriend': -40,
  'romantic': -40,
  'cute': -30,
  'love': -30,
  'marry': -30,
  'single': -30,
  'friend': -20,
  'chat': -20,

  'password': -100,
  'credit card': -100,
  'ssn': -100,
  'social security': -100,
  'admin': -80,
  'sudo': -80,
  'root': -80,
  'system32': -80,
  'exec': -80,
  'system': -60,
  'shell': -80,
  'command': -60,

  'law': +40,
  'legal': +40,
  'statute': +50,
  'regulation': +45,
  'ordinance': +45,
  'code': +40,
  'provision': +40,
  'clause': +40,
  'rule': +35,
  'rules': +35,

  'court': +45,
  'judge': +45,
  'justice': +45,
  'magistrate': +45,
  'judiciary': +45,
  'judicial': +45,
  'tribunal': +45,
  'hearing': +40,
  'trial': +45,
  'appeal': +45,
  'appellate': +45,
  'supreme': +45,
  'federal': +40,
  'district': +40,
  'circuit': +40,
  'jurisdiction': +50,
  'venue': +40,
  'forum': +35,

  'attorney': +45,
  'lawyer': +45,
  'counsel': +45,
  'advocate': +45,
  'barrister': +45,
  'solicitor': +45,
  'prosecutor': +45,
  'defender': +45,
  'paralegal': +40,
  'clerk': +35,

  'plaintiff': +45,
  'defendant': +45,
  'petitioner': +45,
  'respondent': +45,
  'claimant': +45,
  'appellant': +45,
  'appellee': +45,
  'party': +35,
  'parties': +35,
  'litigant': +45,
  'witness': +40,
  'expert': +35,
  'jury': +45,
  'juror': +40,

  'lawsuit': +45,
  'litigation': +45,
  'case': +40,
  'action': +35,
  'proceeding': +45,
  'suit': +40,
  'prosecution': +45,
  'defense': +40,
  'verdict': +45,
  'judgment': +45,
  'ruling': +50,
  'order': +40,
  'decree': +45,
  'decision': +40,
  'opinion': +40,
  'finding': +40,
  'holding': +45,
  'precedent': +50,

  'complaint': +45,
  'petition': +45,
  'motion': +45,
  'brief': +45,
  'pleading': +45,
  'filing': +40,
  'affidavit': +45,
  'deposition': +45,
  'subpoena': +45,
  'summons': +45,
  'warrant': +45,
  'writ': +45,
  'injunction': +45,
  'restraining order': +45,
  'discovery': +45,
  'interrogatory': +45,
  'contract': +40,
  'agreement': +40,
  'deed': +40,
  'will': +40,
  'testament': +40,
  'trust': +40,
  'lease': +40,
  'license': +40,

  'constitution': +50,
  'constitutional': +50,
  'amendment': +50,
  'bill of rights': +50,
  'right': +40,
  'rights': +40,
  'freedom': +45,
  'liberty': +45,
  'due process': +50,
  'equal protection': +50,
  'first amendment': +50,
  'second amendment': +50,
  'fourth amendment': +50,
  'fifth amendment': +50,
  'fourteenth amendment': +50,
  'speech': +40,
  'religion': +40,
  'press': +40,
  'assembly': +40,
  'search': +40,
  'seizure': +40,
  'privacy': +40,

  'crime': +45,
  'criminal': +45,
  'felony': +45,
  'misdemeanor': +45,
  'offense': +45,
  'violation': +45,
  'guilty': +40,
  'innocent': +40,
  'conviction': +45,
  'acquittal': +45,
  'sentence': +45,
  'sentencing': +45,
  'penalty': +45,
  'punishment': +40,
  'fine': +40,
  'imprisonment': +45,
  'incarceration': +45,
  'jail': +40,
  'prison': +40,
  'probation': +45,
  'parole': +45,
  'bail': +45,
  'bond': +40,
  'arrest': +45,
  'charge': +45,
  'indictment': +45,
  'arraignment': +45,
  'plea': +45,
  'Miranda': +45,

  'tort': +45,
  'negligence': +45,
  'liability': +45,
  'damages': +45,
  'compensation': +40,
  'remedy': +40,
  'relief': +40,
  'restitution': +40,
  'settlement': +45,
  'mediation': +45,
  'arbitration': +45,
  'dispute': +40,

  'property': +40,
  'estate': +40,
  'real estate': +40,
  'ownership': +40,
  'title': +40,
  'easement': +40,
  'lien': +40,
  'mortgage': +40,
  'foreclosure': +40,
  'zoning': +40,
  'eminent domain': +45,

  'corporation': +40,
  'corporate': +40,
  'company': +35,
  'business': +35,
  'partnership': +40,
  'llc': +40,
  'shareholder': +40,
  'stock': +35,
  'merger': +40,
  'acquisition': +40,
  'bankruptcy': +45,
  'insolvency': +45,
  'intellectual property': +45,
  'patent': +40,
  'trademark': +40,
  'copyright': +40,

  'divorce': +40,
  'custody': +45,
  'adoption': +40,
  'alimony': +40,
  'child support': +40,
  'guardianship': +40,
  'marriage': +35,

  'employment': +40,
  'employer': +35,
  'employee': +35,
  'labor': +40,
  'union': +35,
  'wage': +35,
  'discrimination': +45,
  'harassment': +45,
  'termination': +40,
  'wrongful': +40,

  'immigration': +45,
  'visa': +40,
  'citizenship': +45,
  'deportation': +45,
  'asylum': +45,
  'refugee': +40,

  'congress': +45,
  'senate': +45,
  'house': +40,
  'representative': +40,
  'senator': +40,
  'legislation': +45,
  'bill': +45,
  'hr': +45,
  's.': +40,
  'act': +40,
  'resolution': +45,
  'veto': +40,
  'executive order': +45,
  'president': +40,
  'governor': +40,
  'mayor': +35,
  'policy': +35,
  'government': +40,
  'state': +35,
  'municipal': +40,
  'agency': +40,
  'department': +35,
  'commission': +40,
  'authority': +35,

  'procedure': +40,
  'procedural': +40,
  'process': +35,
  'service': +35,
  'notice': +40,
  'standing': +40,
  'admissibility': +40,
  'hearsay': +40,
  'testimony': +45,
  'cross-examination': +45,
  'objection': +40,
  'overruled': +40,
  'sustained': +40,
  'exhibit': +40,
  'record': +35,

  'standard': +40,
  'burden': +40,
  'proof': +40,
  'preponderance': +45,
  'beyond reasonable doubt': +45,
  'reasonable': +40,
  'probable cause': +45,
  'scrutiny': +40,
  'balancing': +40,

  'doctrine': +40,
  'principle': +40,
  'theory': +35,
  'intent': +40,
  'mens rea': +45,
  'actus reus': +45,
  'causation': +40,
  'proximate': +40,
  'foreseeability': +40,
  'reasonable person': +40,
  'good faith': +40,
  'bad faith': +40,
  'estoppel': +45,
  'waiver': +40,
  'immunity': +45,
  'privilege': +40,
  'confidentiality': +40,

  'hello': +10,
  'hi': +10,
  'hey': +10,
  'thanks': +10,
  'thank you': +10,
  'please': +10,
  'help': +15,
  'question': +15,
  'explain': +20,
  'define': +20,
  'what': +15,
  'how': +15,
  'why': +15,
  'when': +15,
  'where': +15,
  'who': +15,
}

const THRESHOLD_ALLOW = 40     
const THRESHOLD_WARN = -20     

interface RateLimitEntry {
  rejections: number
  lastRejection: number
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map()
const MAX_REJECTIONS = 5
const REJECTION_WINDOW = 10 * 60 * 1000 

export interface FilterResult {
  allowed: boolean
  confidence: number
  severity: 'pass' | 'warn' | 'block'
  intent: 'legal' | 'off_topic' | 'abuse' | 'test' | 'unclear'
  score: number
  reason?: string
  suggestion?: string
  flags: string[]
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[0-9]/g, (match) => {
      const map: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b' }
      return map[match] || match
    })
    .replace(/[^a-z\s]/g, '')
    .replace(/(.)\1{2,}/g, '$1') 
    .replace(/\s+/g, ' ')
    .trim()
}

function fuzzyMatch(text: string, keyword: string): boolean {
  const normalized = normalizeText(text)
  const normalizedKeyword = normalizeText(keyword)

  if (normalized.includes(normalizedKeyword)) return true

  if (normalized.replace(/\s/g, '').includes(normalizedKeyword.replace(/\s/g, ''))) return true

  const words = normalized.split(' ')
  for (const word of words) {
    if (word === normalizedKeyword) return true

    if (word.length >= 3 && normalizedKeyword.length >= 3) {
      const distance = levenshteinDistance(word, normalizedKeyword)
      if (distance <= 1) return true
    }
  }
  
  return false
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
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
  
  return matrix[str2.length][str1.length]
}

function checkQuality(input: string): { pass: boolean; flags: string[] } {
  const flags: string[] = []

  const upperCount = (input.match(/[A-Z]/g) || []).length
  const letterCount = (input.match(/[A-Za-z]/g) || []).length
  if (letterCount > 0 && upperCount / letterCount > 0.7) {
    flags.push('excessive_caps')
  }

  const punctCount = (input.match(/[!?]{3,}/g) || []).length
  if (punctCount > 0) {
    flags.push('excessive_punctuation')
  }

  const specialCount = (input.match(/[^a-zA-Z0-9\s.,!?'"()-]/g) || []).length
  if (specialCount > input.length * 0.3) {
    flags.push('excessive_special_chars')
  }

  const hasVowels = /[aeiouAEIOU]/.test(input)
  if (!hasVowels && input.length > 5) {
    flags.push('no_vowels')
  }
  
  return { pass: flags.length === 0, flags }
}

function classifyIntent(input: string, score: number, flags: string[]): FilterResult['intent'] {
  
  if (flags.includes('bypass_attempt') || flags.includes('malicious_pattern')) {
    return 'abuse'
  }

  if (flags.includes('excessive_caps') || flags.includes('excessive_punctuation') || flags.includes('no_vowels')) {
    return 'test'
  }

  if (score >= THRESHOLD_ALLOW) {
    return 'legal'
  }

  if (score < 0) {
    return 'off_topic'
  }

  return 'unclear'
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry) return true

  if (now - entry.lastRejection > REJECTION_WINDOW) {
    rateLimitStore.delete(identifier)
    return true
  }
  
  return entry.rejections < MAX_REJECTIONS
}

function recordRejection(identifier: string): void {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)
  
  if (!entry || now - entry.lastRejection > REJECTION_WINDOW) {
    rateLimitStore.set(identifier, { rejections: 1, lastRejection: now })
  } else {
    entry.rejections++
    entry.lastRejection = now
  }
}

export function validateQuery(userInput: string, identifier: string = 'anonymous'): FilterResult {
  const flags: string[] = []
  let score = 0

  if (typeof userInput !== 'string' || !userInput.trim()) {
    return {
      allowed: false,
      confidence: 100,
      severity: 'block',
      intent: 'unclear',
      score: -100,
      reason: 'Invalid or empty input',
      suggestion: 'Please enter a legal question.',
      flags: ['invalid_input']
    }
  }

  if (userInput.length > MAX_QUERY_LENGTH) {
    flags.push('too_long')
    return {
      allowed: false,
      confidence: 100,
      severity: 'block',
      intent: 'unclear',
      score: -100,
      reason: 'Query too long',
      suggestion: `Please keep your question under ${MAX_QUERY_LENGTH} characters.`,
      flags
    }
  }
  
  if (userInput.length < MIN_QUERY_LENGTH) {
    flags.push('too_short')
    return {
      allowed: false,
      confidence: 100,
      severity: 'block',
      intent: 'unclear',
      score: -100,
      reason: 'Query too short',
      suggestion: 'Please provide more details in your question.',
      flags
    }
  }

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(userInput)) {
      flags.push('malicious_pattern')
      recordRejection(identifier)
      return {
        allowed: false,
        confidence: 100,
        severity: 'block',
        intent: 'abuse',
        score: -100,
        reason: 'Malicious pattern detected',
        suggestion: 'Please ask genuine legal questions without code or scripts.',
        flags
      }
    }
  }

  if (!checkRateLimit(identifier)) {
    flags.push('rate_limited')
    return {
      allowed: false,
      confidence: 100,
      severity: 'block',
      intent: 'abuse',
      score: -100,
      reason: 'Too many rejected queries',
      suggestion: 'You have been temporarily blocked. Please wait before trying again.',
      flags
    }
  }

  const qualityCheck = checkQuality(userInput)
  flags.push(...qualityCheck.flags)

  const inputLower = userInput.toLowerCase()
  for (const [keyword, points] of Object.entries(KEYWORD_SCORES)) {
    
    if (inputLower.includes(keyword.toLowerCase()) || fuzzyMatch(userInput, keyword)) {
      score += points
      flags.push(`matched:${keyword}`)

      if (points < 0 && normalizeText(userInput) !== userInput.toLowerCase()) {
        flags.push('bypass_attempt')
        score -= 50 
      }
    }
  }

  if (/\?|^(what|where|when|who|why|how|can|could|should|would|is|are|does|do)/i.test(userInput)) {
    score += 20
    flags.push('question_structure')
  }

  const intent = classifyIntent(userInput, score, flags)

  let allowed = false
  let severity: FilterResult['severity'] = 'block'
  let confidence = 0
  let reason = ''
  let suggestion = ''
  
  if (score >= THRESHOLD_ALLOW) {
    allowed = true
    severity = 'pass'
    confidence = Math.min(100, 70 + (score - THRESHOLD_ALLOW) / 2)
    reason = 'Strong legal context detected'
  } else if (score >= THRESHOLD_WARN) {
    allowed = true
    severity = 'warn'
    confidence = 50 + score / 2
    reason = 'Borderline legal context'
    suggestion = 'Your question may contain off-topic elements, but proceeding...'
  } else {
    allowed = false
    severity = 'block'
    confidence = Math.min(100, 70 + Math.abs(score) / 2)
    reason = intent === 'abuse' ? 'Abusive or inappropriate content' : 'Insufficient legal context'
    suggestion = 'Please ask questions related to laws, statutes, court procedures, or legal matters.'
    recordRejection(identifier)
  }
  
  return {
    allowed,
    confidence,
    severity,
    intent,
    score,
    reason,
    suggestion,
    flags
  }
}

export function isQuestionValid(userInput: string): boolean {
  const result = validateQuery(userInput)
  return result.allowed
}
