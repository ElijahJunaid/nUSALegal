export const courtProcedures = [
  {
    title: 'File Case',
    description: 'Prosecution files the case with CI and Affidavit',
    category: 'criminal'
  },
  {
    title: 'Summons Delivery',
    description: 'Court procures and delivers summons',
    category: 'criminal'
  },
  {
    title: 'Arraignment',
    description: "Arraignment (doesn't happen if held in absentia)",
    category: 'criminal'
  },
  { title: 'Pre-trial Motions', description: 'Pre-trial motions', category: 'criminal' },
  { title: 'Trial Scheduling', description: 'Scheduling for trial', category: 'criminal' },
  {
    title: 'Opening Statements',
    description: 'Opening statements (Prosecution), Opening Statements (Defense)',
    category: 'criminal'
  },
  {
    title: 'Witness 1 Prosecution',
    description: 'Witness 1 (Prosecution), Cross-Examination (Defense)',
    category: 'criminal'
  },
  {
    title: 'Witness 2 Prosecution',
    description: 'Witness 2 (Prosecution), Cross-Examination (Defense)',
    category: 'criminal'
  },
  {
    title: 'Witness 3 Prosecution',
    description: 'Witness 3 (Prosecution), Cross-Examination (Defense)',
    category: 'criminal'
  },
  {
    title: 'Witness 1 Defense',
    description: 'Witness 1 (Defense), Cross-Examination (Prosecution)',
    category: 'criminal'
  },
  {
    title: 'Witness 2 Defense',
    description: 'Witness 2 (Defense), Cross-Examination (Prosecution)',
    category: 'criminal'
  },
  {
    title: 'Witness 3 Defense',
    description: 'Witness 3 (Defense), Cross-Examination (Prosecution)',
    category: 'criminal'
  },
  {
    title: 'Closing Statements',
    description: 'Closing Statements (Prosecution), Closing Statements (Defense)',
    category: 'criminal'
  }
]

export const supremeCourtRulings = [
  {
    id: 'scotus-2024-001',
    title: 'United States v. Johnson',
    citation: '598 U.S. ___ (2024)',
    date: '2024-03-15',
    category: 'Criminal Law',
    summary:
      'Held that warrantless searches of digital devices require probable cause under the Fourth Amendment.',
    pdfUrl: '/pdf/scotus/2024-001.pdf',
    docketNumber: '23-1024',
    majorityJustice: 'Justice Roberts',
    voteCount: '6-3'
  },
  {
    id: 'scotus-2024-002',
    title: 'Smith v. nUSA Corporation',
    citation: '598 U.S. ___ (2024)',
    date: '2024-02-28',
    category: 'Civil Rights',
    summary: 'Affirmed that corporations have limited First Amendment rights in commercial speech.',
    pdfUrl: '/pdf/scotus/2024-002.pdf',
    docketNumber: '23-876',
    majorityJustice: 'Justice Sotomayor',
    voteCount: '7-2'
  },
  {
    id: 'scotus-2024-003',
    title: 'Doe v. Department of Education',
    citation: '597 U.S. ___ (2024)',
    date: '2024-01-10',
    category: 'Administrative Law',
    summary: 'Reversed lower court decision on agency interpretation of statutory language.',
    pdfUrl: '/pdf/scotus/2024-003.pdf',
    docketNumber: '22-543',
    majorityJustice: 'Justice Gorsuch',
    voteCount: '5-4'
  },
  {
    id: 'scotus-2023-001',
    title: 'Brown v. Federal Trade Commission',
    citation: '596 U.S. ___ (2023)',
    date: '2023-12-05',
    category: 'Regulatory Law',
    summary: 'Limited FTC authority to regulate non-deceptive business practices.',
    pdfUrl: '/pdf/scotus/2023-001.pdf',
    docketNumber: '22-987',
    majorityJustice: 'Justice Kavanaugh',
    voteCount: '6-3'
  },
  {
    id: 'scotus-2023-002',
    title: 'Anderson v. City of New York',
    citation: '596 U.S. ___ (2023)',
    date: '2023-11-15',
    category: 'Constitutional Law',
    summary: 'Upheld municipal ordinance under rational basis review.',
    pdfUrl: '/pdf/scotus/2023-002.pdf',
    docketNumber: '22-654',
    majorityJustice: 'Justice Barrett',
    voteCount: '8-1'
  }
]

export const districtCourtArchive = [
  {
    id: 'dc-ny-2024-001',
    title: 'United States v. Martinez',
    court: 'Southern District of New York',
    date: '2024-03-20',
    category: 'Drug Trafficking',
    summary: 'Convicted on multiple counts of drug trafficking and conspiracy.',
    judge: 'Hon. Sarah Johnson',
    outcome: 'Guilty verdict on all counts',
    sentencing: '15 years imprisonment',
    docketNumber: '1:24-cr-00456'
  },
  {
    id: 'dc-ca-2024-001',
    title: 'Tech Corp v. Federal Government',
    court: 'Northern District of California',
    date: '2024-03-15',
    category: 'Civil Rights',
    summary: 'Challenge to federal surveillance program under Fourth Amendment.',
    judge: 'Hon. Michael Chen',
    outcome: 'Case dismissed for lack of standing',
    docketNumber: '3:24-cv-00789'
  },
  {
    id: 'dc-tx-2024-001',
    title: 'Garcia v. State of Texas',
    court: 'Western District of Texas',
    date: '2024-03-10',
    category: 'Immigration',
    summary: 'Deportation proceedings challenged due to procedural errors.',
    judge: 'Hon. Robert Martinez',
    outcome: 'Proceedings vacated, remanded for new hearing',
    docketNumber: '6:24-cv-00123'
  },
  {
    id: 'dc-fl-2024-001',
    title: 'Estate of Williams v. Insurance Co',
    court: 'Middle District of Florida',
    date: '2024-03-05',
    category: 'Insurance Law',
    summary: 'Bad faith insurance claim dispute over policy coverage.',
    judge: 'Hon. Patricia Davis',
    outcome: 'Settlement reached during mediation',
    docketNumber: '2:24-cv-00456'
  },
  {
    id: 'dc-il-2024-001',
    title: 'Chicago Teachers Union v. Board of Education',
    court: 'Northern District of Illinois',
    date: '2024-02-28',
    category: 'Labor Law',
    summary: 'Collective bargaining agreement dispute over working conditions.',
    judge: 'Hon. James Wilson',
    outcome: 'Arbitration award upheld',
    docketNumber: '1:24-cv-00321'
  }
]
