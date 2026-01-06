
export const constitutionArticles = [
  { 
    number: 1, 
    title: 'Article I', 
    content: '', 
    summary: 'This article creates the legislative branch, dividing it into two chambers. It lays out qualifications for office, how bills become laws, the impeachment process, and powers vested in Congress.' 
  },
  { 
    number: 2, 
    title: 'Article II', 
    content: '', 
    summary: 'This article defines the executive branch, with a President elected for a six-month term. It details election process, eligibility, succession protocols, and Presidential powers including military command, treaty negotiation, and appointments.' 
  },
  { 
    number: 3, 
    title: 'Article III', 
    content: '', 
    summary: 'This article establishes the judicial branch, granting powers to a supreme Court and lower courts. It gives federal courts authority over constitutional issues, foreign affairs, and inter-municipal conflicts.' 
  },
  { 
    number: 4, 
    title: 'Article IV', 
    content: '', 
    summary: 'This article sets the framework for the relationship between federal government and municipalities. It guarantees mutual recognition of public records and rights across all municipalities.' 
  },
  { 
    number: 5, 
    title: 'Article V', 
    content: '', 
    summary: 'This article outlines how constitutional amendments are proposed and adopted. Congress initiates changes with two-thirds vote, requiring Supreme Court review and approval.' 
  }
]

export const constitutionAmendments = [
  { number: 1, title: 'Amendment I', content: 'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; of the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.', summary: 'Safeguards fundamental freedoms including religion, speech, press, assembly, and petition.' },
  { number: 2, title: 'Amendment II', content: 'A well-regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.', summary: 'Affirms the right to bear arms, linking it to a well-regulated militia.' },
  { number: 3, title: 'Amendment III', content: 'No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.', summary: 'Protects private property from forced housing of soldiers.' },
  { number: 4, title: 'Amendment IV', content: 'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.', summary: 'Guards against unreasonable searches and seizures, requiring warrants with probable cause.' },
  { number: 5, title: 'Amendment V', content: 'No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, nor shall any person be subject for the same offense to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.', summary: 'Protects rights including indictment by grand jury, protection from double jeopardy, self-incrimination privilege, due process, and just compensation for property takings.' }
]

// Export articles as an object indexed by key (article1, article2, etc) for the [key].ts API
export const articles = constitutionArticles.reduce((acc, article) => {
  acc[`article${article.number}`] = article;
  return acc;
}, {} as Record<string, typeof constitutionArticles[0]>);

