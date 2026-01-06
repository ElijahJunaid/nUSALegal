export default defineEventHandler((event) => {
    const volume = parseInt(getRouterParam(event, 'volume') || '2')

    validateApiAccess(event, `courts/${volume}`)

    const volumesData: Record<number, any> = {
        2: {
            volume: 2,
            title: 'Supreme Court Board Volume 2',
            cases: [
                {
                    title: 'JedBartlett v. Federal Elections Commission',
                    description: 'A motion by the FEC is only bias if it is prejudicial or non-uniform.',
                    type: 'CIVIL',
                    docket: '38HT1',
                    citation: '2. US. 1 (2016)'
                },
                {
                    title: 'United States v. Las Vegas',
                    description: 'The Tow Truck Service is under the jurisdiction of the City.',
                    type: 'CIVIL',
                    docket: '38G17',
                    citation: '2. US. 4 (2016)'
                },
                {
                    title: 'HHPrinceGeorge v. Capitalized',
                    description: 'House of Representatives cannot ordain resolutions that are unconstitutional.',
                    type: 'CIVIL',
                    docket: '1-10',
                    citation: '2. US. 8 (2016)'
                },
                {
                    title: 'Qolio v. United States',
                    description: 'Regulating speech based on content is unconstitutional and other 1st Amend. issues.',
                    type: 'CIVIL',
                    docket: '2-3',
                    citation: '2. US. 11 (2016)'
                },
                {
                    title: 'CodyGamer100 v. United States',
                    description: 'A plea entered under a joinder is not representative of all those charged under the joinder.',
                    type: 'CRIMINAL',
                    docket: '2-4',
                    citation: '2. US. 18 (2016)'
                },
                {
                    title: 'United States v. Las Vegas',
                    description: 'The Las Vegas City Council could not legislate ordinances under the previous Constitution.',
                    type: 'CIVIL',
                    docket: '2-5',
                    citation: '2. US. 24 (2016)'
                },
                {
                    title: 'Ryan_Revan v. United States',
                    description: 'Congress cannot delegate an unconstitutional amount of authority to the Municipality[ies].',
                    type: 'CIVIL',
                    docket: '2-7',
                    citation: '2. US. 34 (2016)'
                },
                {
                    title: 'Bob561 v. Mindy_Lahiri',
                    description: 'A hearing is not required for Contempt of Court (18 U.S.C. 401) and other COC issues.',
                    type: 'CIVIL',
                    docket: '2-9',
                    citation: '2. US. 44 (2016)'
                },
                {
                    title: 'DonaldJTrump v. United States',
                    description: 'No Court may act without a "case or controversy" nor issue orders without due process applied.',
                    type: 'CIVIL',
                    docket: '2-10',
                    citation: '2. US. 57 (2016)'
                },
                {
                    title: 'Likeanub v. United States',
                    description: 'A trial in absentia may only occur with notice and other due process rights.',
                    type: 'CRIMINAL',
                    docket: '2-11',
                    citation: '2. US. 60 (2016)'
                },
                {
                    title: 'Zeyad567ALT v. SteffJonez',
                    description: 'A Judge may not issue contempt for intra legem issues and other COC issues.',
                    type: 'CIVIL',
                    docket: '2-12',
                    citation: '2. US. 70 (2016)'
                },
                {
                    title: 'Sudden v. Helleoh',
                    description: 'Reaffirming George v. Capitalized, 2 U.S. 8 (2016).',
                    type: 'CIVIL',
                    docket: '2-16',
                    citation: '2. US. 86 (2016)'
                },
                {
                    title: 'AdamStratton v. Technozo',
                    description: 'Nomination and approval of Respondent is unconstitutional and violates the Ineligiblity Clause of Article 1.',
                    type: 'CIVIL',
                    docket: '2-17',
                    citation: '2. US. 88 (2016)'
                }
            ]
        },
        3: {
            volume: 3,
            title: 'Supreme Court Board Volume 3',
            cases: [
                {
                    title: 'Norman_Paperman v. U.S. Military',
                    description: 'Case remanded to District Court per All Writs Act.',
                    type: 'CIVIL',
                    docket: '3-1',
                    citation: '3. US. 1 (2017)'
                },
                {
                    title: 'SigmaHD v. U.S. Marshals Service',
                    description: 'Government cannot fire employees for conduct or speech off team without substantial interest.',
                    type: 'CIVIL',
                    docket: '3-4',
                    citation: '3. US. 2 (2017)'
                },
                {
                    title: 'Idiotic_Leader v. Las Vegas',
                    description: 'Reaffirming United States v. Las Vegas, 2 U.S. 24 (2017).',
                    type: 'CIVIL',
                    docket: '3-5',
                    citation: '3. US. 18 (2017)'
                },
                {
                    title: 'MythicOne v. National Security Agency',
                    description: 'Second amendment protects right to bear arms, not an unlimited right to bear in any manner.',
                    type: 'CIVIL',
                    docket: '3-6',
                    citation: '3. US. 28 (2017)'
                },
                {
                    title: 'British2004 v. Ozzymen',
                    description: 'Speaker of the House cannot vote except in cases of tiebreaking votes (OLD CONST.).',
                    type: 'CIVIL',
                    docket: '3-7',
                    citation: '3. US. 60 (2017)'
                }
            ]
        },
        4: {
            volume: 4,
            title: 'Supreme Court Board Volume 4',
            cases: [
                {
                    title: 'United States v. Las Vegas',
                    description: 'Courts should not issue a ruling without an injury to be redressed, thus violating the C&C Clause.',
                    type: 'CIVIL',
                    docket: '4-2',
                    citation: '4. US. 1 (2017)'
                },
                {
                    title: 'Seaborn v. Lukassie',
                    description: 'No Judge may issue contempt in cases which they do not preside in and other COC issues.',
                    type: 'CIVIL',
                    docket: '4-8',
                    citation: '4. US. 5 (2017)'
                },
                {
                    title: '12904 v. Khemists',
                    description: 'At-will employment is constitutional, Fourteenth Amendment issues and other employee rights.',
                    type: 'CIVIL',
                    docket: '4-3',
                    citation: '4. US. 11 (2017)'
                },
                {
                    title: 'Snowbleed v. Nevada Highway Patrol',
                    description: 'Lower Court Affirmed in equally divided Court.',
                    type: 'CIVIL',
                    docket: '4-26',
                    citation: '4. US. 20 (2017)'
                }
            ]
        },
        5: {
            volume: 5,
            title: 'Supreme Court Board Volume 5',
            cases: [
                {
                    title: 'In Re United States',
                    description: 'Application for Group Warrant.',
                    type: 'Civil',
                    docket: '5-14',
                    citation: '5. US. 1 (2018)'
                },
                {
                    title: 'RoExplo v. United States',
                    description: 'A five month imprisonment sentence did not violate the 8th Amendment.',
                    type: 'CRIMINAL',
                    docket: '5-7',
                    citation: '5. US. 7 (2018)'
                },
                {
                    title: 'United States v. TPR',
                    description: 'Application for Group Warrant, the size of the group should be a considered factor and necessity.',
                    type: 'CRIMINAL',
                    docket: '5-22',
                    citation: '5. US. 36 (2018)'
                },
                {
                    title: 'Code_Rager v. United States',
                    description: 'A pardon vacates a sentence and in turn vacates any possibility of review of the vacated sentence.',
                    type: 'CRIMINAL',
                    docket: '5-25',
                    citation: '5. US. 58 (2018)'
                },
                {
                    title: 'Kirkman v. Nevada Highway Patrol',
                    description: 'Suits cannot occur for injuries not relevant to the pursued jurisdiction.',
                    type: 'Civil',
                    docket: '5-33',
                    citation: '5. US. 62 (2018)'
                },
                {
                    title: 'George v. United States',
                    description: 'Rules of mootness apply to Anytime Review cases.',
                    type: 'Civil',
                    docket: '5-35',
                    citation: '5. US. 66 (2018)'
                },
                {
                    title: 'Ex Parte United States',
                    description: 'Prosecutions by the District of Columbia Gov. stayed in Federal Court pending SCOTUS case.',
                    type: 'CRIMINAL',
                    docket: '5-43',
                    citation: '5. US. 72 (2018)'
                },
                {
                    title: 'Nuinik v. United States',
                    description: 'Compulsory Process Clause is a right and the right to call witnesses is imperative to a fair trial.',
                    type: 'CRIMINAL',
                    docket: '5-27',
                    citation: '5. US. 80 (2018)'
                },
                {
                    title: 'Heave v. United States',
                    description: 'Writ dismissed for mootness.',
                    type: 'Civil',
                    docket: '5-41',
                    citation: '5. US. 85 (2018)'
                },
                {
                    title: 'George v. Troyan',
                    description: 'Courts shall follow mandatory language regarding procedure in statutes.',
                    type: 'Civil',
                    docket: '5-49',
                    citation: '5. US. 91 (2018)'
                },
                {
                    title: 'Dominator v. United States',
                    description: 'Upholding George v. Troyan, 5 U.S. 91 (2018) and vacating the lower Court judgement.',
                    type: 'CRIMINAL',
                    docket: '5-55',
                    citation: '5. US. 94 (2018)'
                },
                {
                    title: 'United States v. District of Columbia',
                    description: 'Municipalities may prosecute city crimes in Federal Court and cannot create their own Courts.',
                    type: 'Civil',
                    docket: '5-43',
                    citation: '5. US. 95 (2018)'
                },
                {
                    title: 'Kirkman v. United States',
                    description: 'No person shall be held in contempt without intent or for issues out of their managable control.',
                    type: 'Civil',
                    docket: '5-63',
                    citation: '5. US. 110 (2018)'
                }
            ]
        },
        6: {
            volume: 6,
            title: 'Supreme Court Board Volume 6',
            cases: [
                {
                    title: 'Technozo v. United States',
                    description: 'Clan Managers and their entities are immune from suit when acting in their official capacities.',
                    type: 'CRIMINAL',
                    docket: '6-64',
                    citation: '6. US. 5 (2018)'
                },
                {
                    title: 'Ultiman v. United States',
                    description: 'Mootness doctrine embraced and Writ dismissed.',
                    type: 'CIVIL',
                    docket: '5-72',
                    citation: '6. US. 19 (2018)'
                },
                {
                    title: 'Benda v. United States',
                    description: 'Congress cannot overly deligate Article III powers to a non-Article III Court.',
                    type: 'CIVIL',
                    docket: '5-75',
                    citation: '6. US. 20 (2018)'
                },
                {
                    title: 'Federal Election Commission v. AcidRaps',
                    description: 'Only SCOTUS may overturn its precedents and how the Court responds to election issues.',
                    type: 'CIVIL',
                    docket: '5-77',
                    citation: '6. US. 42 (2018)'
                },
                {
                    title: 'Kirkman v. Bank of America',
                    description: "Upholding the 'Enhancing the Judiciary Act's provisions on dismissals with prejudice.",
                    type: 'CIVIL',
                    docket: '6-20',
                    citation: '6. U.S. 49 (2019)'
                }
            ]
        },
        7: {
            volume: 7,
            title: 'Supreme Court Board Volume 7',
            cases: [
                {
                    title: 'Kirkman v. State of Columbia',
                    description: 'State of Columbia (Nevada and DC combined) is unconstitutional and other bill severability issues.',
                    type: 'CIVIL',
                    docket: '7-1 & 7-2',
                    citation: '7. US. 1 (2019)'
                },
                {
                    title: 'Cursive v. United States',
                    description: 'Political question doctrine is "judicial policy" and due process does not apply to impeachment[s].',
                    type: 'CIVIL',
                    docket: '7-5',
                    citation: '7. US. 9 (2019)'
                },
                {
                    title: 'In Re Haven',
                    description: 'Mootness doctrine applied.',
                    type: 'CIVIL',
                    docket: '7-6',
                    citation: '7. US. 42 (2019)'
                },
                {
                    title: 'In Re Giordano',
                    description: 'Expulsion of judges and the Fourteenth Amendment.',
                    type: 'CIVIL',
                    docket: '7-13',
                    citation: '7. US. 46 (2019)'
                },
                {
                    title: 'Party v. Board of Law Examiners',
                    description: 'Separation of powers issues and the trias politica doctrine and EB control of a Federal Bar exam.',
                    type: 'CIVIL',
                    docket: '7-18',
                    citation: '7. US. 50 (2019)'
                },
                {
                    title: 'Lydxia v. House of Representatives',
                    description: 'Congressional subpoenas and mootness.',
                    type: 'CIVIL',
                    docket: '7-26',
                    citation: '7. US. 56 (2019)'
                }
            ]
        },
        8: {
            volume: 8,
            title: 'Supreme Court Board Volume 8',
            cases: [],
            isEmpty: true,
            emptyMessage: 'NOTHING WAS RELEASED, U HIGH SUPREME COURT BACK THEN?'
        },
        9: {
            volume: 9,
            title: 'Supreme Court Board Volume 9',
            cases: [
                {
                    title: 'Reset v. United States',
                    description: 'Definition of "high crimes and misdemeanors" and impeachment issues (removal overturned).',
                    type: 'CIVIL',
                    docket: '9-13',
                    citation: '9. U.S. 1 (2020)'
                },
                {
                    title: 'Caldwell v. Dream',
                    description: 'Court ordered apologies are constitutional, may only be a secondary relief.',
                    type: 'CIVIL',
                    docket: '9-15',
                    citation: '9. U.S. 73 (2020)'
                },
                {
                    title: 'Monkey v. United States',
                    description: 'Utilisation of the suspension rule 62 in FRCRMP must be proper and constitutional issues.',
                    type: 'CRIMINAL',
                    docket: '9-21',
                    citation: '9. U.S. 77 (2020)'
                },
                {
                    title: 'Caldwell v. United States',
                    description: 'Congress lacks the authority to issue arrest warrants and AOS outside an Article III Court.',
                    type: 'CIVIL',
                    docket: '9-14',
                    citation: '9. U.S. 85 (2020)'
                },
                {
                    title: 'Kolibob v. United States',
                    description: 'Requirements to issue a stay order.',
                    type: 'CRIMINAL',
                    docket: '9-35',
                    citation: '9. U.S. 104 (2020)'
                },
                {
                    title: 'Tools v. United States',
                    description: "Due process must be applied to EBB's, President cannot terminate those he doesn't appoint.",
                    type: 'CIVIL',
                    docket: '9-17',
                    citation: '9. U.S. 113 (2020)'
                }
            ]
        },
        10: {
            volume: 10,
            title: 'Supreme Court Board Volume 10',
            cases: [
                {
                    title: 'United States v. jetpacksoup',
                    description: 'Dismissals with prejudice in accordance to EJA (legislation supporting this repealed)',
                    type: 'CRIMINAL',
                    docket: '10-04',
                    citation: '10 U. S. 85 (2020)'
                },
                {
                    title: 'Rafellus v. Papasbestboy',
                    description: 'Recusals under Sec. 144 and showing bias is personal rather than judicial in nature',
                    type: 'CIVIL',
                    docket: '10-08',
                    citation: '10 U. S. 87 (2020)'
                }
            ]
        },
        11: {
            volume: 11,
            title: 'Supreme Court Board Volume 11',
            cases: [
                {
                    title: 'Mianngamer12345 et al. v. United States',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '11-17',
                    citation: '11 U. S. ___ (2021)'
                },
                {
                    title: 'Task v. United States',
                    description: 'DESCRIPTION',
                    type: 'CRIMINAL',
                    docket: '9-51',
                    citation: '11. U.S. ___ (2021)'
                }
            ]
        },
        12: {
            volume: 12,
            title: 'Supreme Court Board Volume 12',
            cases: [],
            isEmpty: true,
            emptyMessage: 'NOTHING HERE!'
        },
        13: {
            volume: 13,
            title: 'Supreme Court Board Volume 13',
            cases: [
                {
                    title: 'Dev_Val v. United States',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '13-01',
                    citation: '13 U.S. ___ (2022)'
                },
                {
                    title: 'AlexbluBear v. United States',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '13-02',
                    citation: '13 U.S. ___ (2022)'
                },
                {
                    title: 'In Re BakedGoods',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '13-03',
                    citation: '13 U.S. ___ (2022)'
                }
            ]
        },
        14: {
            volume: 14,
            title: 'Supreme Court Board Volume 14',
            cases: [],
            isEmpty: true,
            emptyMessage: 'THEY SKIPPED THIS!'
        },
        15: {
            volume: 15,
            title: 'Supreme Court Board Volume 15',
            cases: [
                {
                    title: 'jsjsbsd v. a_attorney, et al.',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '15-06',
                    citation: '15 U. S. ____ (2023)'
                },
                {
                    title: 'In Re Attorney_Yada',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '15-08',
                    citation: '15 U. S. ____ (2023)'
                }
            ]
        },
        16: {
            volume: 16,
            title: 'Supreme Court Board Volume 16',
            cases: [
                {
                    title: 'In re Marcus Castle Kriegsherr',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '16-09',
                    citation: '16 U.S. ____ (2024)'
                },
                {
                    title: 'Noob News Network v. AdamStratton, et al.',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '16-11',
                    citation: '16 U.S. ____ (2024)'
                },
                {
                    title: 'Nasanovuh v. United States',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '16-15',
                    citation: '16 U.S. ____ (2024)'
                },
                {
                    title: 'JoshMiller v. United States',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '16-18',
                    citation: '16 U.S. ____ (2024)'
                },
                {
                    title: 'JoshMiller v. House of Representatives',
                    description: 'DESCRIPTION',
                    type: 'CIVIL',
                    docket: '16-20',
                    citation: '16 U.S. ____ (2024)'
                }
            ]
        },
        17: {
            volume: 17,
            title: 'Supreme Court Board Volume 17',
            cases: [],
            isEmpty: true,
            emptyMessage: 'NOTHING YET!'
        }
    }

    const volumeData = volumesData[volume]

    if (!volumeData) {
        throw createError({
            statusCode: 404,
            statusMessage: `Volume ${volume} not found`
        })
    }

    return volumeData
})
