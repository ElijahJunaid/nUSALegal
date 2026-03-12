export interface CongressBill {
  number: string
  description: string
  pdfPath: string
  type: 'hr' | 's' | 'hjres' | 'sjres' | 'hconres' | 'sconres' | 'hres' | 'sres'
  category: 'congress'
}

export const congressBills: CongressBill[] = [
  {
    number: 'S. 1',
    description:
      '110TH CONGRESS 1ST SESSION S. 1 To authorize the Attorney General and immediate delegates thereof to administer oaths and receive sworn testimony in support of probable cause determinations. IN THE SENATE OF THE UNITED STATES February 8TH, 2026 Mr. Aanjdmarcus OF THE STATE OF New Jersey, for himself, introduced the following bill; To authorize the Attorney General and immediate delegates thereof to administer oaths and receive sworn testimony in support of probable cause determinations. Be it en',
    pdfPath: 'bills/s-1.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 5',
    description:
      '109th Congress 1st Session H. R. 5 An Act to consolidate certain executive agencies and functions, enshrine the “Activity Consolidation Executive Order” into law, and for other purposes. IN THE HOUSE OF REPRESENTATIVES December 12, 2025 EternallyBlueEyes introduced the following resolution; which was referred to the Committee on the Judiciary, Ways & Means, and Government Oversight A BILL An Act to consolidate certain executive agencies and functions, enshrine the “Activity Consolidation Executi',
    pdfPath: 'bills/h-r-5.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 2',
    description:
      '109th CONGRESS 1st Session H.R. 2 To prohibit the act of cuffrushing and to establish civil liability under 42 U.S.C. § 1983 IN THE HOUSE OF THE UNITED STATES December 8th, 2025 Mr. TonyyLewinsky of Kentucky & TackoSereigneFall introduced the following act; which was referred to the House Committee on the Judiciary, Ways & Means, and Government Oversight. A BILL To prohibit the act of cuffrushing and to establish civil liability under 42 U.S.C. § 1983 Be it enacted by the Senate and House of Rep',
    pdfPath: 'bills/h-r-2.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.J.Res. 9',
    description:
      '109th Congress 2nd Session H. J. Res. 9 Declaring that a state of war exists between the United States and the United Kingdom and authorizing the use of the Armed Forces of the United States. IN THE HOUSE OF REPRESENTATIVES January 4th, 2025 TonyyLewinsky of Kentucky introduced the following resolution; which was referred to the House Committee on Judiciary, Ways & Means, and Government Oversight JOINT RESOLUTION Declaring that a state of war exists between the United States and the United Kingd',
    pdfPath: 'bills/h-j-res-9.pdf',
    type: 'hjres',
    category: 'congress'
  },
  {
    number: 'H.R. 6',
    description:
      '108th Congress 1st Session H. R. 6 To award a Congressional Gold Medal to Jon_Ral, and for other purposes. IN THE HOUSE OF REPRESENTATIVES October 29, 2025 FuriousTurtle06 introduced the following bill; which was referred to the floor of the House A BILL To award a Congressional Gold Medal to Jon_Ral, and for other purposes. Be it enacted by the Senate and House of Representatives of the United States of America in Congress assembled, SECTION 1. SHORT TITLE. This Act may be cited as the “Jon_Ral',
    pdfPath: 'bills/h-r-6.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 103',
    description:
      '108th CONGRESS 1ST Session S. 103 “To redesignate the Department of Defense as the Department of War”. IN THE SENATE OF THE UNITED STATES 9th of october 2025 Mr. Issjrjfh, for himself, introduced the following bill; which was referred to the floor of the Senate. AN ACT “Designation of Department of Defense”. Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION 1: SHORT TITLE (a) This Act may be cited as the "Department of War Restoration Ac',
    pdfPath: 'bills/s-103.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 5 Grand Jury Recomposition Act',
    description:
      '107TH CONGRESS 4TH SESSION To modify the composition and term length of grand juries by amending the previously established provisions at federal law inherited through the United States Code. IN THE HOUSE OF REPRESENTATIVES SEPTEMBER 6TH, 2025 Mr. OLD_DUDE47 OF THE STATE OF VIRGINIA, for himself, introduced the following bill; which was referred to the Committee on [...] A BILL To modify the composition and term length of grand juries by amending the previously established provisions at federal ',
    pdfPath: 'bills/h-r-5-grand-jury-recomposition-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 11 | BATHTUB Act',
    description:
      '105TH CONGRESS 2ND SESSION H.R. 11 To permanently bar Arthur_Chen from holding or enjoying any civil office under the United States, due to his participation in an attempted insurrection and unlawful actions against Congress ———————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES May 22nd, 2025 Representative Sheev_PalpatineTGR (for himself, Rep. EdmundCarter, Rep. Da_Beatle1, and Rep. Mr_Anomalywza) has introduced the following bill; which was referred to the Committee on the Judiciary, E',
    pdfPath: 'bills/h-r-11-bathtub-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 97',
    description:
      '107th CONGRESS 2nd] Session S. Res 97 To promote public safety, and fairness Act. IN THE SENATE OF THE UNITED STATES 10th of August 2025 Mr. Issjrjfh, for himself, introduced the following bill; which was referred to the floor of the Senate. A BILL To promote public safety. Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION 1: SHORT TITLE (a) This piece of legislation shall be referred to as the “Public Safety and Fairness Act” or as “S. ',
    pdfPath: 'bills/s-97.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 98',
    description:
      '107th CONGRESS 2nd] Session S. Res 98 To Amend Public Law 96-3. IN THE SENATE OF THE UNITED STATES 10th of August 2025 Mr. Jsjsjbsd, for himself and on the recommendation and behalf of Mr Detachment_Result and IggysThe_Fool, introduced the following bill; which was referred to the floor of the Senate. A BILL To Amend Public Law 96-3. Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION 1: SHORT TITLE (a) This piece of legislation shall be r',
    pdfPath: 'bills/s-98.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 64 Termination and Suspension Justification Act',
    description:
      'S. 64 To ensure that employees who are terminated or suspended are given a justification IN THE SENATE OF THE UNITED STATES 16th of February 2025 Mr jsjsjbsd (for himself) introduced the following act; which was referred to the floor of the Senate. A BILL To ensure that employees who are terminated or suspended are given a justification. Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION 1: GENERAL PROVISIONS a) This Act may be cited as t',
    pdfPath: 'bills/s-64-termination-and-suspension-justification-act.pdf',
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
    description:
      '91STCONGRESS 2NDSESSION H.R.5 ToestablishthePresidentiallineofsuccession ———————— INTHEHOUSEOFREPRESENTATIVESOFTHEUNITED STATES January25th,2024 SpeakerGeorgeGodsent(forhimself)hasintroducedthe followingbill. ———————— ANACT ToestablishthePresidentiallineofsuccession BeitenactedbytheHouseofRepresentativesandtheSenateof theUnitedStatesinCongressAssembled. SEC.1—SHORTTITLE (a) Thispieceoflegislationshallbereferredtoasthe“Presidential SuccessionAct”. SEC.2—GENERALPROVISIONS (a)Anyclause,subsectionor',
    pdfPath: 'bills/h-r-5-presidential-succession-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 2: Federal Protective Zone Act of 2024',
    description:
      'S. 2 To establish a legal standard for protective zones and provide regulations for the enforcement in, and control of, these areas and protection of federal protect- ees. IN THE SENATE OF THE UNITED STATES January 23, 2024 chexburger (for himself) introduced the following bill; which was referred to the Senate floor. A BILL To establish a legal standard for protective zones and provide regu- lations for the enforcement in, and control of, these areas and protection of federal protectees. Be it ',
    pdfPath: 'bills/s-2-federal-protective-zone-act-of-2024.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 32',
    description:
      '______________________________________ ATTHETHIRDSESSION MARCH9TH2024 MR.SAVIORJOSHHFROMTHESTATEOFFLORIDAPRESENTSTHIS ACTWHICHHOLDSJUDGESACCOUNTABLEFORETHICALAND CRIMINALVIOLATIONSDURINGTHEIRTENUREINOFFICE.WITH THEBLESSINGOFMR.LACRYMAANDMR.LORDSIGHTS. BEITENACTEDBYTHESENATEANDTHEHOUSEOF REPRESENTATIVESOFTHEUNITEDSTATESINCONGRESS ASSEMBLY. PARTI.GENERALPROVISIONS (a)SHORTTITLE.ThisActmaybecitedasthe"CourtEthicsAct" (b)EFFECTIVEDATE.ThisActshallgointoeffectimmediately uponpassage. (c)SEVERABILITY.',
    pdfPath: 'bills/h-r-32.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 5: Defense Force Protection Act',
    description:
      '3RD]CONGRESS 1ST]Session S.5 Tolayoutthestructure,powers,purpose,andorganizationoftheDefense ForceProtectionAgency;andforotherpurposes. INTHESENATEOFTHEUNITEDSTATES 9thofFebruary2024 Mrjsjsjbsd(forhimselfandMrPeepGPT)introducedthe followingact;whichwasreferredtotheflooroftheSenate. ABILL Tolayoutthestructure,powers,purpose,andorganizationoftheDefense ForceProtectionAgency;andforotherpurposes. BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesinCongressAssembled. SECTION1:GENERALPR',
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
    description:
      '91STCONGRESS 2NDSESSION H.R.4 ToformallyestablishandregulatetheUnitedStatesCapitolPolice ———————— INTHEHOUSEOFREPRESENTATIVESOFTHEUNITED STATES January25th,2024 SpeakerGeorgeGodsent(forhimself)hasintroducedthe followingbill. ———————— ANACT ToformallyestablishandregulatetheUnitedStatesCapitolPolice BeitenactedbytheHouseofRepresentativesandtheSenateof theUnitedStates, SEC.1—SHORTTITLE (a)ThisresolutionshallbeknownasH.R.4ofthe91stCongress, ortheCapitolPoliceAct. SEC.2—GENERALPROVISIONS (a)Anyclause',
    pdfPath: 'bills/h-r-4-capitol-police-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 27',
    description:
      'H.R.27 92ndCONGRESS 2ndSession H.R.27 Tomakenecessaryamendments INTHEHOUSEOFTHEREPRESENTATIVESOFTHEUNITED STATES March3,2024 JustTheJudge(forhimself)hasintroducedthefollowingbill;whichshall bereadontheHousefloorandreferredtotheappropriatecommittee. ABILL Tomakenecessaryamendments BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesinCongressAssembled. SEC.1-SHORTTITLE (a)ThisActmaybecitedasthe“amendments”. SEC.2.-H.R.3. (a)AllmentionsunderthissectionrefertoitemsinhousebillH.R.3. (b)',
    pdfPath: 'bills/h-r-27.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 20',
    description:
      'H.R.20 1 92NDC ONGRESS 2 ND S ESSION H.R.20 TogivetheformerYada’sandYadaClan(YC)aMonthof RemembranceandHistoryforalltheyhavedonetohelp NUSAgrow INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES February22,2024 Nice_yadaforhimself,(Saviorjoshhasaco-writer,Mefus &Tk0masachecker,andJustYourDailyNoob& Aimlusionforinspiration)haveintroducedthefollowing bill;whichshallbereadontheHousefloorandreferred totheappropriatecommittee. ———————————————————————— ANACT ToremembertheYadaClan BeitenactedbytheSenateandH',
    pdfPath: 'bills/h-r-20.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 41',
    description:
      'TregosaurusCharter 1337TregokianWay,Washington,DC20004 THEMUNICIPALITYOFWASHINGTON, DISTRICTOFCOLUMBIA D.CCityCharter ANNOTATED WITHAMENDMENTSTOANDINCLUDINGTHOSE APPROVEDINTHEPRIMARYAND CONSOLIDATEDELECTIONS, Preamble WeThePeople, underauthorityconferredbytheConstitutionoftheUnitedStates,thePeopleoftheMunicipality ofWashington,DistrictofColumbia(hereafterreferredtoasD.C.)enactthisCharterasthe establishmentofthemunicipalityforthepurposeofprotectingandenhancingthedevelopment, establishjustice;insu',
    pdfPath: 'bills/h-r-41.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 48',
    description:
      'H.R.#48 1 92 nd C ONGRESS 5thS ESSION H.R.48 Toallowmunicipalandfederalemployeestocommit crimewhileonthe“AmericanCitizen”teamwithoutthe riskofTerminationfromgovernmentormunicipal agenciesordepartments. ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES March,18th,2024 AsherHendo(forhimself,Epicwarrior99, Anthonytheking9291 ,saviorjosh,MitsuoMochizuki, LuckyVinick,AlexJCabot )hasintroducedthefollowing bill;whichshallbereadontheHousefloorandreferred totheappropriatecommittee. —',
    pdfPath: 'bills/h-r-48.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 46',
    description: 'Campaign Finance Act',
    pdfPath: 'bills/h-r-46.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 56',
    description:
      'H.R.56 1 92 ND C ONGRESS 2 ND S ESSION H.R.56 ToestablishtheNationalGuard ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES 6thofApril,2024 Speaker.LuckyVinick(forhimself)hasintroducedthe followingbill;whichshallbereadontheHousefloorand referredtotheappropriatecommittee. ———————————————————————— ANACT ToestablishtheNationalGuard BeitenactedbytheSenateandHouseofRepresentatives oftheUnitedStatesinCongressAssembled. SEC.1—SHORTTITLE (a)Thispieceoflegislationshallbereferredtoas ',
    pdfPath: 'bills/h-r-56.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 47',
    description:
      'H.R.47 1 92NDC ONGRESS 5THS ESSION H.R.47 ToEnsureGovernmentTransparencyandKeepCongress Informed ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES March,25th,2024 ArmanFoley,fromtheStateofVirginia,forhimself,has introducedthefollowingbill;whichshallbereadonthe Housefloorandreferredtotheappropriatecommittee. ———————————————————————— ANACT ToEnsureGovernmentTransparencyandKeepCongress Informed BeitenactedbytheSenateandHouseofRepresentatives oftheUnitedStatesinCongressAssembled',
    pdfPath: 'bills/h-r-47.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 50',
    description:
      '92 ND S ESSION 4 TH S ESSION H.R.50 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES March29,2024 PresentedbyHouseMajorityLeaderMRALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee ontheJudiciary,GovernmentAffairsandEthics. ___________________________ ANACT Tocreateauniformsourceoflawregardingthejudiciary, government,proceduresandothermatters BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesofAmerica',
    pdfPath: 'bills/h-r-50.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 17',
    description:
      '______________________________________ ATTHEFIFTHSESSION APRIL5TH2024 MR.SAVIORJOSHHFROMTHESTATEOFFLORIDAPRESENTSTHIS ACTWHICHWASREFERREDTOTHEFLOOROFTHESENATE.AN ACTTOAMENDTITLE18OFTHEU.S.CODE,TOPROHIBIT UNAUTHORIZEDPRIVATEPARAMILITARYACTIVITY,ANDFOR OTHERPURPOSES. BEITENACTEDBYTHESENATEANDTHEHOUSEOF REPRESENTATIVESOFTHEUNITEDSTATESINCONGRESS ASSEMBLY. PARTI.GENERALPROVISIONS (a)SHORTTITLE.ThisActmaybecitedasthe"Preventing ParamilitaryActivityAct" (b)EFFECTIVEDATE.ThisActshallgointoeffectimmedia',
    pdfPath: 'bills/s-17.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 76',
    description:
      '93 RD CONGRESS 2 ND SESSION H.R.76 ______________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April25,2024 PresentedbytheHouseMajorityLeaderMr.AlexJ. CabotfromtheGreatStateofSouthCarolinaonbehalfof PresidentGeorgeGodsentandtheDepartmentofthe Treasury. ______________________________ AnAct MakingconsolidatedappropriationsforthefiscalmonthsofApril andMayintheyearTwoThousandandTwenty-Four. SECTION1.SHORTTITLE. ThisActmaybecitedasthe‘Consolidated AppropriationsandAuthorizationsActofAprila',
    pdfPath: 'bills/h-r-76.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 60',
    description:
      '92 ND S ESSION 5 TH S ESSION H.R.60 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April13,2024 PresentedbyHouseMajorityLeaderMR.ALEXJ.CABOT representingtheGreatStateofSouthCarolinasponsoredby MR.SELWYNCOSGROVEhavingintroducedthisbillwhichwas laterreferredtotheCommitteeontheJudiciary,Government AffairsandEthics. ___________________________ ANACT Tore-codifyanabuseoftoolsstatutefollowingtheNUSAlaw reset BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesofAmeric',
    pdfPath: 'bills/h-r-60.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 54',
    description:
      "H.R.54 1 92 ND C ONGRESS 2 ND S ESSION H.R.54 TosetruleslettingthePresidentappointofficials,limit actingpositions'duration. ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES 5thofApril,2024 SpeakerLuckyVinick(forhimself)hasintroducedthe followingbill;whichshallbereadontheHousefloorand referredtotheappropriatecommittee. ———————————————————————— ANACT TosetruleslettingthePresidentappointofficials,limit actingpositions'duration. BeitenactedbytheSenateandHouseofRepresentatives o",
    pdfPath: 'bills/h-r-54.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 75',
    description:
      '93 RD C ONGRESS 2NDS ESSION H.R.73 ActtoEstablishMilitaryCourtswithintheUnited StatesArmedForces. ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES April24,2024, Representative103315fromthegreatstateofMichigan forhimselfhasintroducedthefollowingResolution; whichshallbereadontheHousefloorandreferredto theappropriatecommittee. ———————————————————————— ANACT ToEstablishMilitaryCourtswithintheUnited StatesArmedForces. BeitenactedbytheSenateandHouseofRepresentatives oftheUnitedSt',
    pdfPath: 'bills/h-r-75.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 70',
    description:
      '93RDCONGRESS 1STSESSION H.R.70 ToamendtheU.S.CodewithrespecttotheSecretService, NationalSecurityAffairs,andtocreateregulationsfortheWhite HouseComplexandcertainReportstoCongress ———————— INTHEHOUSEOFREPRESENTATIVESOFTHEUNITED STATES April21st,2024 HOUSEMAJORITYLEADERMR.ALEXJ.CABOT(for himself)hasintroducedthefollowingbill. ———————— ANACT ToamendtheU.S.CodewithrespecttotheSecretService, NationalSecurityAffairs,andtocreateregulationsfortheWhite HouseComplexandcertainReportstoCongress Beitenactedby',
    pdfPath: 'bills/h-r-70.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 59',
    description:
      '92 ND S ESSION 6thS ESSION H.R.59 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April3,2024 PresentedbyHouseMajorityLeaderMRALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee onForeignAffairsandIntelligence. ___________________________ ANACT TostrengthentheabilityoftheUnitedStatestoprevent,protect against,respondto,andrecoverfromnationalsecuritythreats. BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedS',
    pdfPath: 'bills/h-r-59.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 55',
    description:
      '92 ND S ESSION 5 TH S ESSION H.R.55 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April6,2024 PresentedbyHouseMajorityLeaderMRALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee ontheJudiciary,GovernmentAffairsandEthics. ___________________________ ANACT Toremovetheundueandunconstitutionalburdenimposedby thecurrentrestrictionsonthepracticeoflawintheUnited States BeitenactedbytheSenateandHouseofRepresentativesofthe',
    pdfPath: 'bills/h-r-55.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'Discretionary Budget Appropiation',
    description:
      'H. R. 94 To provide the executive branch with a further discretionary budget fund to aid in day-to-day operations. _____________________________ IN THE UNITED STATES HOUSE OF REPRESENTATIVES MAY 29, 2024 MR. ARMAN FOLEY (for himself) introduced the following bill: which was later referred to the Committee on the Judiciary, Ethics and Government Affairs. _____________________________ A BILL Be it enacted by the Senate and the House of Representatives 1 of the United States in Congress assembled. ',
    pdfPath: 'bills/discretionary-budget-appropiation.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 69',
    description:
      '93 RD C ONGRESS 1 ST S ESSION H.R.69 ToProperlyRegulateSecurityCompanieswithinthe UnitedStatesofAmerica ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES April20,2024, Representative103315fromthegreatstateofMichigan forhimselfhasintroducedthefollowingResolution; whichshallbereadontheHousefloorandreferredto theappropriatecommittee. ———————————————————————— ANACT ToRegulateSecurityCompanieswithintheUnited StatesofAmerica BeitenactedbytheSenateandHouseofRepresentatives oftheUni',
    pdfPath: 'bills/h-r-69.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 78',
    description:
      'H.R. 78 To codify the recommendations of the United States Commission on the Revision of the United States Code _____________________________ IN THE UNITED STATES HOUSE OF REPRESENTATIVES APRIL 27, 2024 MR. ALEX J. CABOT (for himself) introduced the following bill: which was later referred to the Committee on the Judiciary, Government Affairs and Ethics. _____________________________ A BILL Be it enacted by the Senate and House of Representatives of 1 the United States in Congress as Assembled. ',
    pdfPath: 'bills/h-r-78.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 68',
    description:
      'H.R.#68 1 92# ST C ONGRESS 8# ST S ESSION H.R.68 TotheUnitedStatesCongress ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES April17,2024, RepresentativeGhillieTacticalfromthegreatstateof Michiganhasintroducedthefollowingbill,whichshall bereadontheHousefloorandreferredtothe appropriatecommittee. ———————————————————————— ANACT ToenhancetransparencybetweentheUnitedStates MilitaryandCongress. BeitenactedbytheSenateandHouseofRepresentatives oftheUnitedStatesinCongressAssembled. ',
    pdfPath: 'bills/h-r-68.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 71',
    description:
      '93 RD C ONGRESS 1 ST S ESSION H.R.71 ActtoEstablishHigherPaygradesforExceptional ServiceintheUnitedStatesMilitary ———————————————————————— INTHEHOUSEOFREPRESENTATIVESOFTHE UNITEDSTATES April21,2024, Representative103315fromthegreatstateofMichigan forhimselfhasintroducedthefollowingResolution; whichshallbereadontheHousefloorandreferredto theappropriatecommittee. ———————————————————————— ANACT ToEstablishHigherPaygradesforExceptional ServiceintheUnitedStatesMilitary BeitenactedbytheSenateandHouseo',
    pdfPath: 'bills/h-r-71.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 57',
    description:
      '92 ND S ESSION 5 TH S ESSION H.R.57 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April6,2024 PresentedbyHouseMajorityLeaderMRALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee ontheJudiciary,GovernmentAffairsandEthics. ___________________________ ANACT Toproduceatribunalofequitytodealwithcontentiousmatters ofemploymentandlaborrelationsintheUnitedStates BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedS',
    pdfPath: 'bills/h-r-57.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 79',
    description:
      '93RDCONGRESS 4thSession H.R.79 ToAssisttheOperationsoftheFederalProtectiveService INTHEHOUSEOFTHEUNITEDSTATES May,4th,2024 Speaker.ArmanFoley,forhimself,introducedthefollowingact; whichwasreferredtotheflooroftheHouse. ABILL ToAssisttheOperationsoftheFederalProtectiveService BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesinCongressAssembled. H.R.79 SECTIONI.SHORTTITLE (a)Thispieceoflegislationshallbereferredtoas“FPS ExpansionAct”oras“FPSEA24” SEC.2.GENERALPROVISIONS (a)Anypartof',
    pdfPath: 'bills/h-r-79.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 62',
    description:
      '92 ND S ESSION 5 TH S ESSION H.R.62 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April13,2024 PresentedbyHouseMajorityLeaderMR.ALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee ontheJudiciary,GovernmentAffairsandEthics. ___________________________ ANACT TorepealtheAntitrustlawscurrentlyenforcedbythe DepartmentofJusticeinordertomaintainafreelabormarket BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedS',
    pdfPath: 'bills/h-r-62.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 51',
    description:
      '92 ND S ESSION 4 TH S ESSION H.R.51 ___________________________ INTHEUNITEDSTATESHOUSEOFREPRESENTATIVES April1,2024 PresentedbyHouseMajorityLeaderMRALEXJ.CABOT representingtheGreatStateofSouthCarolinahaving introducedthisbillwhichwaslaterreferredtotheCommittee ontheJudiciary,GovernmentAffairsandEthics. ___________________________ ANACT Toprovidefederalregulationsfortheprotectionofemployed individualsintheUnitedStates BeitenactedbytheSenateandHouseofRepresentativesofthe UnitedStatesofAmericainCon',
    pdfPath: 'bills/h-r-51.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 37',
    description:
      'CONGRESSNO.93S.37 CIVILOFFICESACTOF2024 ANACT ToensurethatcivilofficesoftheUnitedStatesaredefinedinlawin accordancewithArticle11oftheU.S.Constitution. INTRODUCEDBY MR.COASTBREEZEofthegreatstateofCaliforniaintroducedthisbill on9August2024(forhimself,VICEPRESIDENTCABOTand PRESIDENTTEASOUPS)whichwaslaterreferredtotheCommitteeon GovernmentAffairs. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Section101.ShortTitle. (a)ThisActs',
    pdfPath: 'bills/s-37.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 38',
    description:
      'CONGRESSNO.93S.38 FEDERALCIVILSERVICEACTOF2024 ANACT Toestablishanapoliticalfederalcivilservicethatensurescontinuity ofgovernmentandallowsforindividualstobuildpermanent expertise. INTRODUCEDBY MR.COASTBREEZEofthegreatstateofCaliforniaintroducedthisbill on9August2024(forhimself,VICEPRESIDENTCABOTand PRESIDENTTEASOUPS)whichwaslaterreferredtotheCommitteeon GovernmentAffairs. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Secti',
    pdfPath: 'bills/s-38.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 34',
    description:
      'CONGRESSNO.93S.34 UNITEDSTATESCODETIMECONVERSIONACT ANACT ToreinstatetheprevioustimeconversioninplacebeforetheLaw Resetof2023andtoensurebetteruniformityandapplicabilityofthe USCodetoROBLOX. INTRODUCEDBY MR.COASTBREEZEofthegreatstateofCaliforniaintroducedthisbill on27July2024(forhimselfandVICEPRESIDENTCABOTwhichwas laterreferredtotheCommitteeonGovernmentAffairs. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Section101.Short',
    pdfPath: 'bills/s-34.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 33',
    description:
      'CONGRESSNO.93S.33 SPEEDYTRIALACT ANACT Toensurethatcriminaldefendantsareprovidedaproperandspeedy trialinaccordancewiththeirfifthandsixthamendmentrightswhilst alsosimplifyingtheprovisionsofthe1974Act. INTRODUCEDBY MR.COASTBREEZEofthegreatstateofCaliforniaintroducedthisbill on27July2024(forhimselfandVICEPRESIDENTCABOTwhichwas laterreferredtotheCommitteeontheJudiciary. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Section101.',
    pdfPath: 'bills/s-33.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 32',
    description:
      'CONGRESSNO.93S.32 SecretServiceExtensionActof2024 ANACT ToextendSecretServiceprotectionforpastPresidentsandVice Presidentsindefinitely. INTRODUCEDBY SenatorGDKfonzoforthegreatstateofIllinoisintroducedthisbillon 25July2024. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Section101.ShortTitle. (a)ThisActshallbereferredtoasthe‘SecretServiceExtensionActof2024’or‘SSEA’as itsshorttitle. Section102.EnforcementandSeverability. (a)T',
    pdfPath: 'bills/s-32.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 35',
    description:
      'S. 35 To re-establish and re-organize the origins for civil claims, torts, and civil liability in the United States. _____________________________ IN THE UNITED STATES SENATE JULY 27, 2024 MR. COAST BREEZE for the great state of CALIFORNIA (for himself and VICE PRESIDENT ALEX J. CABOT introduced the following bill: which was later referred to the Committee on the Judiciary, Government Affairs and Ethics. _____________________________ A BILL Be it enacted by the Senate and House of Representative',
    pdfPath: 'bills/s-35.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 36',
    description:
      'S.36 1 94 TH C ONGRESS 2 ND S ESSION S.36 ToprovidetheFederalProtectiveServicewithalegal mandatetoprotectmembersofCongress ———————————————————————— INTHESENATEOFTHEUNITEDSTATES August8th,2024 SenatorCoastBreeze(forhimself,DirectorRoyaltySyn, andtheStateofCalifornia)hasintroducedthefollowing bill;whichshallbereferredtotheCommitteeon GovernmentAffairs. ———————————————————————— ANACT ToprovidetheFederalProtectiveServicewithalegal mandatetoprotectmembersofCongress BeitenactedbytheSenateandHouseofRep',
    pdfPath: 'bills/s-36.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 39',
    description:
      'CONGRESSNO.93S.39 DISTRICTCOURTAPPELLATEPANELACTOF2024 ANACT Toestablishapaneltoprovidespeedyjusticeandtoresolveoften simplelegalerrorswhilstestablishingamoreclearlowercourtrecord forhighcourtappeals. INTRODUCEDBY MR.COASTBREEZEofthegreatstateofCaliforniaintroducedthisbill on9August2024(forhimselfandVICEPRESIDENTCABOT)which waslaterreferredtotheCommitteeonGovernmentAffairs. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Sec',
    pdfPath: 'bills/s-39.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 116',
    description: 'Federal Budget Allocation Act of Fall 2024',
    pdfPath: 'bills/h-r-116.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.J.Res. 1',
    description: 'Authorization for Use of Military Force',
    pdfPath: 'bills/h-j-res-1.pdf',
    type: 'hjres',
    category: 'congress'
  },
  {
    number: 'H.R. 2',
    description:
      '109th CONGRESS 1st Session H.R. 2 To prohibit the act of cuffrushing and to establish civil liability under 42 U.S.C. § 1983 IN THE HOUSE OF THE UNITED STATES December 8th, 2025 Mr. TonyyLewinsky of Kentucky & TackoSereigneFall introduced the following act; which was referred to the House Committee on the Judiciary, Ways & Means, and Government Oversight. A BILL To prohibit the act of cuffrushing and to establish civil liability under 42 U.S.C. § 1983 Be it enacted by the Senate and House of Rep',
    pdfPath: 'bills/h-r-2.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 3',
    description: 'Technozo Congressional Gold Medal Act',
    pdfPath: 'bills/h-r-3.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S.J.Res. 10',
    description:
      '99 TH CONGRESS 3 RD SESSION S . J. R E S. 10 IN THE SENATE OF THE UNITED STATES 9 / 2 4 / 2 0 2 4 MR. TACUSS FROM THE STATE OF NEVADA PRESENTS THE FOLLOWING RESOLUTION; WHICH WAS REFERRED TO THE FLOOR OF THE SENATE. ** J O I N T R E S O L U T I O N TO AUTHORIZE DISCORD FORUM VOTING Resolved by the Senate and House of Representatives in Congress assembled S E C T I O N I . (a) No resolution, rule, or order heretofore adopted by Congress, or its bodies, adopted prior to or subsequent to the passag',
    pdfPath: 'bills/s-j-res-10.pdf',
    type: 'sjres',
    category: 'congress'
  },
  {
    number: 'S. 51 Federal Budget of December 2024',
    description:
      'Prepared by President Tea S. Oupss Department of the Treasury Washington : 2024 As we transition into the second term of the Soups Administration, we are taking steps to revitalize areas of our government that need renewed support. In collaboration with Congress, we previously established a Federal Budget to fund executive branch departments and agencies; however, since much of the budget went unused, we have decided to redirect these funds toward initiatives that will have a greater impact on a',
    pdfPath: 'bills/s-51-federal-budget-of-december-2024.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 18',
    description:
      'One Hundred Second Congress of the United States of America AT THE FIFTH SESSION Presented by Rep. Kacey Montagu, and Co-sponsored by Rep. Bluismmm in the House of Representatives. Be it enacted by the Senate and House of Representative of the United States of America in Congress assembled, on the 29 th of December. An Act PART I. – HOMELAND SECURITY DEPARTMENT. SECTION I. There shall be constituted, as a principal executive department of the United States Government, the Department of Homeland ',
    pdfPath: 'bills/h-r-18.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 49 Department of Commerce and Labor Act of 2024',
    description:
      'S. 49 101st congress 5th Session S. 49 To establish a Department of Commerce and Labor IN THE SENATE OF THE UNITED STATES 8 th of December, 2024 Mr. Snowbleed (for himself) introduced the following joint resolution; which was referred to the Senate committee on the Judiciary. A BILL To establish and define the Department of Commerce and Labor TITLE I – GENERAL PROVISIONS AND DEFINITIONS SEC. 101 – SHORT TITLE (a) This bill shall be referred to as “The Department of Commerce and Labor Act of 2024',
    pdfPath: 'bills/s-49-department-of-commerce-and-labor-act-of-2024.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 1 Department of Commerce and Labor Expansion Act',
    description:
      'H. R. 1 1 103RD CONGRESS 1ST SESSION H. R. 1 To make necessary amendments to the Department of Commerce & Labor Act of 2024 to expand the amount of businesses able to register by lifting most requirements for sole proprietary ownerships and other types of businesses that can be approved at the discretion of the Secretary. ———————————————————————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES February 4th, 2025 Rep. NikkiHaleyGPT of Nevada (for herself and Secretary Captaina_Nico of the De',
    pdfPath: 'bills/h-r-1-department-of-commerce-and-labor-expansion-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 62 Inspect Our Soldiers',
    description:
      '102nd CONGRESS 5TH Session S. 62 To require enhance congressional oversight of military inspections IN THE SENATE OF THE UNITED STATES January 16, 2025 Mr. RoFiles (for himself) introduced the following act; which was referred to the Committee on Homeland Security, A BILL To require enhance congressional oversight of military inspections Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. S. 62 SEC 1. SHORT TITLE This Act shall be referred to as t',
    pdfPath: 'bills/s-62-inspect-our-soldiers.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 53 Department of Justice Improvement Act',
    description:
      'CONGRESSNO.102S.53 DepartmentofJusticeImprovementAct ANACT ToimprovethejurisdictionoftheBureauofPrisons INTRODUCEDBY SenatorGDKfonzoforthegreatstateofIllinoisamendedthisbillon 24December2024. BeitenactedbytheSenateandHouseofRepresentativesoftheUnitedStatesofAmerica inCongressassembled– TITLEI–GENERALPROVISIONS Section101.ShortTitle. (a)ThisActshallbereferredtoastheDepartmentofJusticeImprovementAct’or‘DOJIA’ asitsshorttitle. Section102.EnforcementandSeverability. (a)ThisActremains‘severable’inacc',
    pdfPath: 'bills/s-53-department-of-justice-improvement-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 59 Capitol Police Jurisdiction and Authority',
    description:
      '102nd CONGRESS 5th SESSION S. 59 To reaffirm the governance and authority of the United States Capitol Police __________________________________ IN THE SENATE OF THE UNITED STATES January 15th, 2025 Mr. Josh Miller (and Mr. TackoSereigneFall) introduced the following Bill; which was referred to the Committee on the Rules and Administration __________________________________ A BILL To reaffirm the governance and authority of the United States Capitol Police Be it enacted by the Senate and House o',
    pdfPath: 'bills/s-59-capitol-police-jurisdiction-and-authority.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 61 Notification of Retracting Nominees',
    description:
      '102nd CONGRESS 5TH Session S. 61 To require the President of the United States to inform Congress on nominations that are retracted IN THE SENATE OF THE UNITED STATES January 16, 2025 Mr. RoFiles (for himself) introduced the following act; which was referred to the Committee on the Judiciary, A BILL To require the President of the United States to inform Congress on nominations that are retracted Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled.',
    pdfPath: 'bills/s-61-notification-of-retracting-nominees.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 65 Public Vehicle Usage Regulation Act',
    description:
      'S. 65 To establish clear regulations for the usage of all public vehicles, ensuring responsible and authorized use of federally owned transportation assets. IN THE SENATE OF THE UNITED STATES 16th of February 2025 Mr jsjsjbsd (for himself and at the recommendation of Juandrito2010) introduced the following act; which was referred to the floor of the Senate. A BILL To establish clear regulations for the usage of all public vehicles, ensuring responsible and authorized use of federally owned trans',
    pdfPath: 'bills/s-65-public-vehicle-usage-regulation-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 7',
    description:
      'H. R. 7 1 103RD CONGRESS 2ND SESSION H. R. 7 To repeal the Preventing Paramilitary Activity Act of 2024, as it is redundant and includes unnecessary provisions ———————————————————————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES February 14th, 2025 Rep. NikkiHaleyGPT of Nevada (for sunloric) has introduced the following bill; which shall be read on the House floor and referred to the appropriate committee. ———————————————————————— AN ACT To revoke the Preventing Paramilitary Activity Ac',
    pdfPath: 'bills/h-r-7.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 10',
    description:
      '103rd CONGRESS 3rd Session H. R. 10 To document the procedures of the Judiciary __________________________________ IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES 02/21/2025 Mr. Not_Ram3 (for himself and touriada2) introduced the following act; which was referred to the floor of the House of Representatives __________________________________ A BILL To document the procedures of the Judiciary. Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled',
    pdfPath: 'bills/h-r-10.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 68',
    description:
      '103rd] CONGRESS 5th ] Session S. 68 To promote accountability, factual correctness and transparency IN THE SENATE OF THE UNITED STATES 28th of March 2025 Mr jsjsjbsd (for himself and Representative Frosty_TheSn0wman) introduced the following act, which was referred to the floor of the Senate. A BILL To promote accountability, factual correctness and transparency Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION 1. General Provision a. Sh',
    pdfPath: 'bills/s-68.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'S. 75',
    description:
      '104th CONGRESS 4th Session S. 75 The purpose of the bill is to repeal Public Law 100-2 IN THE SENATE OF THE UNITED STATES April 26th 2025 Mr. bathamza (for himself) introduced the following act; which was referred to the Committee on JEGA A BILL The purpose of the bill is to repeal Public Law 100-2 Be it enacted by the Senate and House of Representatives of the United States in Congress Assembled. SECTION I. GENERAL PROVISION a. This piece of legislation shall be referred to as “S.75”or as “Repe',
    pdfPath: 'bills/s-75.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 12 | RAT Act',
    description:
      '105TH CONGRESS 2ND SESSION H.R. 12 To provide for an Acting-Chief Justice in the event of a vacancy in the office of the Chief Justice ———————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES May 23rd, 2025 Representative Sheev_PalpatineTGR (for himself) has introduced the following bill; which was referred to the Committee on the Judiciary, Ethics, and Government Oversight. ———————— AN ACT To provide for an Acting-Chief Justice in the event of a vacancy in the office of the Chief Justice B',
    pdfPath: 'bills/h-r-12-rat-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'H.R. 16 | The Federal Government Protection Act',
    description:
      '105TH CONGRESS 3RD SESSION H.R. 16 To address the need for a more robust and functional form of protection for Federal Government Officials ———————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES May 30th, 2025 Representative Sheev_PalpatineTGR (for himself,) has introduced the following bill; which was referred to the Committee on Homeland Security & Armed Services. ———————— AN ACT To address the need for a more robust and functional form of protection for Federal Government Officials Be ',
    pdfPath: 'bills/h-r-16-the-federal-government-protection-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 82 | The BELLA Act',
    description:
      '106th ] CONGRESS 1st ] Session S. 82 An Act to establish citizenship requirements for judicial appointments to protect the integrity of the judiciary. IN THE SENATE OF THE UNITED STATES June 14th, 2025 Mr. robloxrules756 for himself, introduced the following act; which was referred to the JEGA Committee. A BILL An Act to establish citizenship requirements for judicial appointments to protect the integrity of the judiciary. Be it enacted by the Senate and House of Representatives of the United St',
    pdfPath: 'bills/s-82-the-bella-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 13 | Judicial Conference Establishment Act',
    description:
      '106th CONGRESS 1st Session H.R. 13 IN THE HOUSE OF REPRESENTATIVES In the Lord’s date of June 11th, 2025 Rep. IggysThe_Fool (FWD) from the State of Texas (for himself), with the blessings of Speaker GatoGaviria (FWD), introduced the following bill; which was referred to the Committee on the Judiciary, for a period to be subsequently determined by the Speaker, in each case for consideration of such provisions as fall within the jurisdiction of the committee concerns. A BILL. To amend 28 U.S. Code',
    pdfPath: 'bills/h-r-13-judicial-conference-establishment-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 83 | Protecting Our Checks and Balances Act (The BATHACUSS Act)',
    description:
      '106th CONGRESS 2nd Session S. 83 To protect our checks and balances IN THE SENATE OF THE UNITED STATES June 16, 2025 Mr. warlockings (for himself, Representative TexBradshaw, Representative EdmundCarter, Representative IggysThe_Fool, Representative FordF150_S, Senator AguilaBread, Senator victorluss, Senator Mr_Choo) introduced the following act; which was referred to the Committee on Government Accountability A BILL To protect our checks and balances Be it enacted by the Senate and House of Rep',
    pdfPath: 'bills/s-83-protecting-our-checks-and-balances-act-the-bathacuss-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 15 | Electioneering Act',
    description:
      '106th CONGRESS 2nd Session H.R. 15 IN THE HOUSE OF REPRESENTATIVES On the date of June 13th, in the year of our Lord, 2025 Rep. NikkiHCabot (FWD) from the State of Nevada (for herself), with Mr_Anomalywza from the State of Illinois and Iggys_TheFool from the State of Texas, has introduced the following bill; which was referred to the Committee on the Judiciary, for a period to be subsequently determined by the Speaker, in each case for consideration of such provisions as fall within the jurisdic',
    pdfPath: 'bills/h-r-15-electioneering-act.pdf',
    type: 'hr',
    category: 'congress'
  },
  {
    number: 'S. 79 | Financial Incentives Act',
    description:
      '106TH CONGRESS S. 79 1ST SESSION IN THE SENATE OF THE UNITED STATES JUNE 09, 2025 Mr. VICTORlUUSS (for himself) introduced the following bill; which was read and referred to the Committee on Rules & Administration A BILL To prevent the abuse of non-ingame incentives in the politics and roleplay of the United States. 1 Be it enacted by the Senate and House of Representa- 2 tives of the United States of America in Congress assembled, 3 SECTION 1. SHORT TITLE. 4 This Act may be cited as the ‘‘Finan',
    pdfPath: 'bills/s-79-financial-incentives-act.pdf',
    type: 's',
    category: 'congress'
  },
  {
    number: 'H.R. 18 | The American Bar Authority Act of 2025',
    description:
      '106TH CONGRESS 3RD SESSION H.R. 18 To provide for the establishment of the American Bar Authority as an independent federal agency overseeing attorney and judge licensing, regulation, ethics enforcement, and related administrative functions within the community. ———————— IN THE HOUSE OF REPRESENTATIVES OF THE UNITED STATES June 20th, 2025 Representative Sheev_PalpatineTGR (for himself, Rep.Gabezilla090909 ) has introduced the following bill; which was referred to the Committee on the Judiciary a',
    pdfPath: 'bills/h-r-18-the-american-bar-authority-act-of-2025.pdf',
    type: 'hr',
    category: 'congress'
  }
]
