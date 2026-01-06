export interface CaseData {
  id: string
  title: string
  description: string
  facts: string
  difficulty?: string
  statute?: string
  evidence?: {
    prosecution?: string[]
    defense?: string[]
    plaintiff?: string[]
  }
  roles?: {
    [key: string]: {
      objectives?: string[]
      key_arguments?: string[]
      key_decisions?: string[]
      available_roles?: Array<{
        name: string
        type: string
        key_testimony: string[]
      }>
      key_considerations?: string[]
      verdict_options?: string[]
    }
  }
}

export interface MockTrialCases {
  criminal: CaseData[]
  civil: CaseData[]
}

const mockTrialCases: MockTrialCases = {
  criminal: [
    {
      id: "cr1",
      title: "United States v. Bill (Chair-Charring Case)",
      description: "Defendant charged with attempted arson under 18 U.S.C. § 844(i)",
      facts: "Bill, an employee at Rip Off., Inc. in Los Angeles, allegedly attempted to burn a chair in his boss's office. The fire spread due to wind from an open window in the 20th-floor penthouse suite. The defendant alerted security and initiated fire protocols, but the office was severely damaged.",
      difficulty: "6/10",
      statute: "18 U.S. Code § 844(i) - Attempted arson (unlawful attempt to damage/destroy a building used in interstate commerce)",
      evidence: {
        prosecution: [
          "Fire brigade supervisor's investigation testimony",
          "Security guard's testimony about defendant's alert",
          "Business certificate proving interstate commerce",
          "Office damage documentation"
        ],
        defense: [
          "Defendant's voluntary alert to security",
          "Initiation of fire protocols by defendant",
          "Employment records showing workplace stress",
          "Wind conditions from open window as contributing factor"
        ]
      },
      roles: {
        judge: {
          objectives: [
            "Ensure proper court procedure",
            "Rule on objections",
            "Give jury instructions",
            "Maintain order in court"
          ],
          key_decisions: [
            "Admissibility of employment records",
            "Relevance of wind conditions testimony"
          ]
        },
        prosecutor: {
          objectives: [
            "Prove attempted arson charge",
            "Establish interstate commerce connection",
            "Show criminal intent"
          ],
          key_arguments: [
            "Deliberate act of bringing matches",
            "Damage to commercial property",
            "Risk to entire building"
          ]
        },
        defense: {
          objectives: [
            "Challenge intent element",
            "Show mitigating circumstances",
            "Highlight voluntary reporting"
          ],
          key_arguments: [
            "No intent for extensive damage",
            "Workplace stress as factor",
            "Immediate action to report"
          ]
        },
        witness: {
          available_roles: [
            {
              name: "Fire Brigade Supervisor",
              type: "Expert",
              key_testimony: [
                "Fire spread pattern analysis",
                "Building safety assessment",
                "Standard fire protocols"
              ]
            },
            {
              name: "Security Guard",
              type: "Fact",
              key_testimony: [
                "Defendant's demeanor when reporting",
                "Timeline of events",
                "Emergency response actions"
              ]
            }
          ]
        },
        jury: {
          key_considerations: [
            "Intent vs accident",
            "Severity of damage",
            "Mitigating factors",
            "Interstate commerce element"
          ],
          verdict_options: [
            "Guilty of attempted arson",
            "Not guilty"
          ]
        }
      }
    }
  ],
  civil: [
    {
      id: "cv1",
      title: "Contract Dispute: Smith v. Jones Construction",
      description: "Plaintiff alleges breach of contract for incomplete home renovation",
      facts: "John Smith hired Jones Construction to renovate his home for $50,000. Work was completed only 60% before Jones Construction abandoned the project. Smith seeks damages for breach of contract and cost to complete with another contractor ($30,000).",
      difficulty: "5/10",
      evidence: {
        plaintiff: [
          "Original contract agreement",
          "Payment receipts ($50,000 paid)",
          "Photos of incomplete work",
          "Quote from new contractor ($30,000)"
        ],
        defense: [
          "Change order requests ignored",
          "Unsafe working conditions created by plaintiff",
          "Partial completion waives damages"
        ]
      },
      roles: {
        judge: {
          objectives: [
            "Determine if contract was breached",
            "Calculate appropriate damages",
            "Rule on admissibility of evidence"
          ],
          key_decisions: [
            "Whether change orders were properly requested",
            "If unsafe conditions justified abandonment",
            "Amount of damages if breach is found"
          ]
        },
        plaintiff: {
          objectives: [
            "Prove contract breach",
            "Show damages incurred",
            "Demonstrate contractor's fault"
          ],
          key_arguments: [
            "Full payment made upfront",
            "Work only 60% complete",
            "Additional $30,000 needed to complete"
          ]
        },
        defense: {
          objectives: [
            "Show justification for stopping work",
            "Demonstrate plaintiff's breach",
            "Minimize damages"
          ],
          key_arguments: [
            "Plaintiff created unsafe conditions",
            "Change orders were ignored",
            "Partial completion reduces damages"
          ]
        },
        witness: {
          available_roles: [
            {
              name: "New Contractor",
              type: "Expert",
              key_testimony: [
                "Assessment of incomplete work",
                "Estimated cost to complete",
                "Industry standards for contracts"
              ]
            },
            {
              name: "Neighbor",
              type: "Fact",
              key_testimony: [
                "Observed work being done",
                "Heard arguments between parties",
                "Timeline of events"
              ]
            }
          ]
        },
        jury: {
          key_considerations: [
            "Was contract breached?",
            "Who is at fault?",
            "What damages are appropriate?",
            "Were there justifiable reasons to stop work?"
          ],
          verdict_options: [
            "Liable for breach (award damages)",
            "Not liable (no damages)"
          ]
        }
      }
    }
  ]
}

export function getRandomCase(caseType: 'criminal' | 'civil'): CaseData | null {
  if (!['criminal', 'civil'].includes(caseType)) {
    console.error('Invalid caseType provided to getRandomCase. Must be "criminal" or "civil"')
    return null
  }
  
  const cases = mockTrialCases[caseType]
  if (!cases || cases.length === 0) {
    console.error('No cases found for caseType:', caseType)
    return null
  }
  
  const randomIndex = Math.floor(Math.random() * cases.length)
  return cases[randomIndex] ?? null
}

export function getCaseById(caseType: 'criminal' | 'civil', caseId: string): CaseData | null {
  if (!['criminal', 'civil'].includes(caseType)) {
    console.error('Invalid caseType provided to getCaseById. Must be "criminal" or "civil"')
    return null
  }
  
  if (typeof caseId !== 'string') {
    console.error('Invalid caseId provided to getCaseById. Must be a string')
    return null
  }
  
  const cases = mockTrialCases[caseType]
  if (!cases) {
    console.error('No cases found for caseType:', caseType)
    return null
  }
  
  const caseFound = cases.find(c => c.id === caseId)
  if (!caseFound) {
    console.error('Case not found for ID:', caseId)
    return null
  }
  
  return caseFound ?? null
}

export function getAllCases(caseType: 'criminal' | 'civil'): CaseData[] {
  if (!['criminal', 'civil'].includes(caseType)) {
    console.error('Invalid caseType provided to getAllCases. Must be "criminal" or "civil"')
    return []
  }
  
  return mockTrialCases[caseType] || []
}
