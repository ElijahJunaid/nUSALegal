export interface CongressBill {
  number: string
  description: string
  pdfPath: string
  type: 'hr' | 's' | 'hjres' | 'sjres' | 'hconres' | 'sconres' | 'hres' | 'sres'
  category: 'congress'
  title?: string
  congress?: number
  publicLaw?: string
}

export const congressBills: CongressBill[] = [
  {
    number: 'S. 1',
    title: "Prosecutor's Sworn Testimony Act of 2026",
    description:
      'Establishes requirements for sworn testimony from prosecutors in criminal proceedings',
    pdfPath: 'bills/s-1.pdf',
    type: 's',
    category: 'congress',
    congress: 118
  },
  {
    number: 'H.R. 5',
    title: 'Executive Consolidation of Holdings and Organization Act of 2025',
    description: 'Consolidates executive branch holdings and reorganizes federal agencies',
    pdfPath: 'bills/h-r-5.pdf',
    type: 'hr',
    category: 'congress',
    congress: 109,
    publicLaw: '109-2'
  },
  {
    number: 'H.R. 2',
    title: 'Cuffrushing Prohibition Act of 2025',
    description: 'Prohibits the practice of cuffrushing in law enforcement procedures',
    pdfPath: 'bills/h-r-2.pdf',
    type: 'hr',
    category: 'congress',
    congress: 109,
    publicLaw: '109-1'
  },
  {
    number: 'H.J.Res. 9',
    title: 'Declaration of War against the United Kingdom and Arab Republic of Egypt',
    description: 'Declares war against the United Kingdom and Arab Republic of Egypt',
    pdfPath: 'bills/h-j-res-9.pdf',
    type: 'hjres',
    category: 'congress',
    congress: 118
  },
  {
    number: 'H.R. 6',
    title: 'Jon_Ral Congressional Gold Medal Act',
    description: 'Awards the Congressional Gold Medal to Jon_Ral for distinguished service',
    pdfPath: 'bills/h-r-6.pdf',
    type: 'hr',
    category: 'congress',
    congress: 118
  },
  {
    number: 'S. 103',
    title: 'Department of War Restoration Act',
    description: 'Restores and reorganizes the Department of War',
    pdfPath: 'bills/s-103.pdf',
    type: 's',
    category: 'congress',
    congress: 108,
    publicLaw: '108-1'
  },
  {
    number: '107-4 | Grand Jury Recomposition Act (H.R. 5)',
    description: 'Grand Jury Recomposition Act',
    pdfPath: 'bills/h-r-5.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 11: BATHTUB Act',
    description: 'BATHTUB Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: '107-1 | Public Safety and Fairness Act (S. 97)',
    description: 'Public Safety and Fairness Act',
    pdfPath: 'bills/s-97.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: '107-2 | Speedy Trial Amendment Act (S. 98)',
    description: 'Speedy Trial Amendment Act',
    pdfPath: 'bills/s-98.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 89-2 | Termination and Suspension Justification Act (S. 64)',
    description: 'Termination and Suspension Justification Act',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 1: Establishment of SWAT & SF',
    description: 'H. R. 1: Establishment of SWAT & SF',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 5: Presidential Succession Act',
    description: 'H. R. 5: Presidential Succession Act',
    pdfPath: 'bills/h-r-5-presidential-succession-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 2: Federal Protective Zone Act of 2024',
    description: 'S. 2: Federal Protective Zone Act of 2024',
    pdfPath: 'bills/s-2-federal-protective-zone-act-of-2024.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 92-4 | Court Ethics Act (H.R. 32)',
    description: 'Court Ethics Act',
    pdfPath: 'bills/h-r-32.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 5: Defense Force Protection Act',
    description: 'S. 5: Defense Force Protection Act',
    pdfPath: 'bills/s-5-defense-force-protection-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 2: Oath of Office Administration Act',
    description: 'H. R. 2: Oath of Office Administration Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 4: Capitol Police Act',
    description: 'H. R. 4: Capitol Police Act',
    pdfPath: 'bills/h-r-4-capitol-police-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-5 | Amendments (H.R. 27)',
    description: 'Amendments',
    pdfPath: 'bills/h-r-27.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-2 | YADA Clan History Month (H.R. 20)',
    description: 'YADA Clan History Month',
    pdfPath: 'bills/h-r-20.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-3 | DC Charter Revised (H.R. 41)',
    description: 'DC Charter Revised',
    pdfPath: 'bills/h-r-41.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-6 | Public Servant Freedom Act of 2024 (H.R. 48)',
    description: 'Public Servant Freedom Act of 2024',
    pdfPath: 'bills/h-r-48.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-7 | Campaign Finance Act (H.R. 46)',
    description: 'Campaign Finance Act',
    pdfPath: 'bills/h-r-46.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 92-8 | National Guard Establishment Act (H.R. 56)',
    description: 'National Guard Establishment Act',
    pdfPath: 'bills/h-r-56.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-1 | Government Information Act (H.R. 47)',
    description: 'Government Information Act',
    pdfPath: 'bills/h-r-47.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-2 | Judicial and Government Procedures Act of 2024 (H.R. 50)',
    description: 'Judicial and Government Procedures Act of 2024',
    pdfPath: 'bills/h-r-50.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-3 | Preventing Paramilitary Activity Act (S. 17)',
    description: 'Preventing Paramilitary Activity Act',
    pdfPath: 'bills/s-17.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number:
      'Public Law 93-4 | Consolidated Appropriations and Authorizations Act of April and May 2024 (H.R. 76)',
    description: 'Consolidated Appropriations and Authorizations Act of April and May 2024',
    pdfPath: 'bills/h-r-76.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-5 | Cabot-Cosgrove Act of 2024 (H.R. 60)',
    description: 'Cabot-Cosgrove Act of 2024',
    pdfPath: 'bills/h-r-60.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-6 | Responsible Executive Powers Act (H.R. 54)',
    description: 'Responsible Executive Powers Act',
    pdfPath: 'bills/h-r-54.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-7 | Military Court Act of 2024 (H.R. 75)',
    description: 'Military Court Act of 2024',
    pdfPath: 'bills/h-r-75.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-8 | Omnibus Revision and Accountability Act (H.R. 70)',
    description: 'Omnibus Revision and Accountability Act',
    pdfPath: 'bills/h-r-70.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-9 | Cabot Patriot Act (H.R. 59)',
    description: 'Cabot Patriot Act',
    pdfPath: 'bills/h-r-59.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-10 | Legal Representation Integrity Act of 2024 (H.R. 55)',
    description: 'Legal Representation Integrity Act of 2024',
    pdfPath: 'bills/h-r-55.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Discretionary Budget Appropiation',
    description: 'Discretionary Budget Appropiation',
    pdfPath: 'bills/discretionary-budget-appropiation.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-14 | Security Company Regulations Act (H.R. 69)',
    description: 'Security Company Regulations Act',
    pdfPath: 'bills/h-r-69.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-15 | SHACCA Act of 2024 (H.R. 78)',
    description: 'SHACCA Act of 2024',
    pdfPath: 'bills/h-r-78.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-16 | USM Transparency Act 2024 (H.R. 68)',
    description: 'USM Transparency Act 2024',
    pdfPath: 'bills/h-r-68.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-17 | An Act to Establish Higher Paygrades (H.R. 71)',
    description: 'An Act to Establish Higher Paygrades',
    pdfPath: 'bills/h-r-71.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-18 | National Employment and Labor Act of 2024 (H.R. 57)',
    description: 'National Employment and Labor Act of 2024',
    pdfPath: 'bills/h-r-57.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-19 | FPS Expansion Act of 2024 (H.R. 79)',
    description: 'FPS Expansion Act of 2024',
    pdfPath: 'bills/h-r-79.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-20 | Free Labor Market Act of 2024 (H.R. 62)',
    description: 'Free Labor Market Act of 2024',
    pdfPath: 'bills/h-r-62.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-21 | Employment Protection and Regulation Act of 2024 (H.R. 51)',
    description: 'Employment Protection and Regulation Act of 2024',
    pdfPath: 'bills/h-r-51.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 93-23 | Civil Offices Act of 2024 (S. 37)',
    description: 'Civil Offices Act of 2024',
    pdfPath: 'bills/s-37.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 97-3 | Federal Civil Service Act of 2024 (S. 38)',
    description: 'Federal Civil Service Act of 2024',
    pdfPath: 'bills/s-38.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 96-4 | USC Time Conversion Act of 2024 (S. 34)',
    description: 'USC Time Conversion Act of 2024',
    pdfPath: 'bills/s-34.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 96-3 | Speedy Trial Act of 2024 (S. 33)',
    description: 'Speedy Trial Act of 2024',
    pdfPath: 'bills/s-33.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 96-1 | Secret Service Expansion Act of 2024 (S. 32)',
    description: 'Secret Service Expansion Act of 2024',
    pdfPath: 'bills/s-32.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 96-2 | Civil Claims and Torts Act of 2024 (S. 35)',
    description: 'Civil Claims and Torts Act of 2024',
    pdfPath: 'bills/s-35.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 97-1 | Federal Congressional Protection Act of 2024 (S. 36)',
    description: 'Federal Congressional Protection Act of 2024',
    pdfPath: 'bills/s-36.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 97-2 | District Court Appellate Panel Act of 2024 (S. 39)',
    description: 'District Court Appellate Panel Act of 2024',
    pdfPath: 'bills/s-39.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 99-2 | Federal Budget Allocation Act of Fall 2024 (H.R. 116)',
    description: 'Federal Budget Allocation Act of Fall 2024',
    pdfPath: 'bills/h-r-116.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 100-1 | Authorization for Use of Military Force (H.J.Res. 1)',
    description: 'Authorization for Use of Military Force',
    pdfPath: 'bills/h-j-res-1.pdf',
    type: 'hjres',
    category: 'congress'
  },
  {
    number: 'Public Law 100-2 | DC Prosecution Authority Act of 2024 (H.R. 2)',
    description: 'DC Prosecution Authority Act of 2024',
    pdfPath: 'bills/h-r-2.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 100-3 | Technozo Congressional Gold Medal Act (H.R. 3)',
    description: 'Technozo Congressional Gold Medal Act',
    pdfPath: 'bills/h-r-3.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 99-3 | To Authorize Discord Forum Voting (S.J.Res. 10)',
    description: 'TO AUTHORIZE DISCORD FORUM VOTING',
    pdfPath: 'bills/s-j-res-10.pdf',
    type: 'sjres',
    category: 'congress'
  },
  {
    number: 'Public Law 102-1 | Federal Budget of December 2024 (S. 51)',
    description: 'Federal Budget of December 2024',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 102-2 | H.R. 18 (H.R. 18)',
    description: 'H.R. 18',
    pdfPath: 'bills/h-r-18.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 102-4 | Department of Commerce and Labor Act of 2024 (S. 49)',
    description: 'Department of Commerce and Labor Act of 2024',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-1 | Department of Commerce and Labor Expansion Act (H.R. 1)',
    description: 'Department of Commerce and Labor Expansion Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Public Law 103-2 | Inspect Our Soldiers (S. 62)',
    description: 'Inspect Our Soldiers',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-3 | Department of Justice Improvement Act (S. 53)',
    description: 'Department of Justice Improvement Act',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-4 | Capitol Police Jurisdiction and Authority (S. 59)',
    description: 'Capitol Police Jurisdiction and Authority',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-5 | Notification of Retracting Nominees (S. 61)',
    description: 'Notification of Retracting Nominees',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-8 | Public Vehicle Usage Regulation Act (S. 65)',
    description: 'Public Vehicle Usage Regulation Act',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 103-6 | An Act to Revoke the PPA Citing Redundancy (H.R. 7)',
    description: 'An Act to Revoke the PPA Citing Redundancy',
    pdfPath: 'bills/h-r-7.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 10: JDA of 2025',
    description: 'JDA of 2025',
    pdfPath: 'bills/h-r-10.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 68: Office of the Auditor General Act',
    description: 'Office of the Auditor General Act',
    pdfPath: 'bills/s-68.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'Public Law 105-2 | Repealment of Public Law 100-2 (S. 75)',
    description: 'Repealment of Public Law 100-2',
    pdfPath: 'bills/s-75.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 12: RAT Act',
    description: 'RAT Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 16: The Federal Government Protection Act',
    description: 'The Federal Government Protection Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: '106-3 | The BELLA Act (S. 82)',
    description: 'The BELLA Act',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: '106-4 | Judicial Conference Establishment Act (H.R. 13)',
    description: 'Judicial Conference Establishment Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 83: Protecting Our Checks and Balances Act (The BATHACUSS Act)',
    description: 'Protecting Our Checks and Balances Act (The BATHACUSS Act)',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: '106-5 | Electioneering Act (H.R. 15)',
    description: 'Electioneering Act',
    pdfPath: '',
    type: 'hr',
    category: 'congress'
  },
  {
    number: '106-6 | Financial Incentives Act (S. 79)',
    description: 'Financial Incentives Act',
    pdfPath: '',
    type: 's',
    category: 'congress'
  },
  {
    number: '106-7 | The American Bar Authority Act of 2025 (H.R. 18)',
    description: 'The American Bar Authority Act of 2025',
    pdfPath: 'bills/h-r-18.pdf',
    type: 'hr',
    category: 'congress'
  }
]
