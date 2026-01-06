// Dados estáticos dos bills congressionais
export const congressBills = [
    {
        number: "H.R. 1",
        description:
            "This bill establishes SWAT and SF under the federal government, able to carry out law enforcement duties.",
        pdfPath: "bills/hr1.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "S. 2",
        description:
            "This bill establishes a legal standard for protective zones and provides regulations for the enforcement in, and control of, these areas and protection of federal protectees.",
        pdfPath: "bills/s2.pdf",
        type: "s",
        category: "congress",
    },
    {
        number: "S. 5",
        description:
            "This bill lays out the structure, powers, purpose, and organization of the Defense Force Protection Agency; and for other purposes.",
        pdfPath: "bills/s5.pdf",
        type: "s",
        category: "congress",
    },
    {
        number: "H.R. 2",
        description:
            "This bill establishes standardized procedures and qualifications for individuals authorized to administer oaths of office in the United States.",
        pdfPath: "bills/hr2.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 4",
        description:
            "This bill establishes and regulates the United States Capitol Police.",
        pdfPath: "bills/hr4.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 5",
        description:
            "This bill establishes the Presidential line of succession.",
        pdfPath: "bills/hr5.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 20",
        description:
            "This bill gives the former Yada's and Yada Clan (YC) a Month of Remembrance and History for all they have done to help NUSA grow.",
        pdfPath: "bills/hr20.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 41",
        description:
            "This bill establishes the structure and functions of Washington, D.C.'s municipal government, defining roles for key officials and departments. It outlines election processes, government powers, and procedures for removing officials. It also emphasizes federal sovereignty, transparency, accountability, and citizens' rights.",
        pdfPath: "bills/hr41.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 32",
        description:
            "This bill holds judges accountable for ethical and criminal violations during their tenure in office.",
        pdfPath: "bills/hr32.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 48",
        description:
            'This bill allows municipal and federal employees to commit crime while on the "American Citizen" team without the risk of Termination from government or municipal agencies or departments.',
        pdfPath: "bills/hr48.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 56",
        description: "This bill establishes the National Guard.",
        pdfPath: "bills/hr56.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 47",
        description:
            "This bill ensures government transparency and keep Congress informed through regular reports from executive branch department heads.",
        pdfPath: "bills/hr47.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 50",
        description:
            "This bill reforms the US judicial system, designates the Supreme Court for judicial discipline, and establishes Magistrate judges. It defines actionable torts, sets statutes of limitations and maximum sentences, and addresses procedural matters in District Courts.",
        pdfPath: "bills/hr50.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "S. 17",
        description:
            "This bill amends Title 18 of the U.S. Code to prohibit unauthorized private paramilitary activity and establish penalties and civil remedies.",
        pdfPath: "bills/s17.pdf",
        type: "s",
        category: "congress",
    },
    {
        number: "H.R. 76",
        description:
            "This bill establishes consolidated appropriations for the fiscal months of April and May in the year 2024.",
        pdfPath: "bills/hr76.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 60",
        description:
            "This bill re-codifies an abuse of tools statute following the NUSA law reset.",
        pdfPath: "bills/hr60.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 54",
        description:
            "This bill sets rules allowing the President to appoint officials and limit the duration of acting positions.",
        pdfPath: "bills/hr54.pdf",
        type: "hr",
        category: "congress",
    },
    {
        number: "H.R. 75",
        description:
            "This bill reforms the military justice system by establishing a Chief Judge Advocate General and independent JAG Corps, defines key terms, outlines roles, and addresses legal confidentiality. It specifies court-martial types and the appeals process.",
        pdfPath: "bills/hr75.pdf",
        type: "hr",
        category: "congress",
    },
];

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "bills/congress");

    try {
        return congressBills;
    } catch (error) {
        console.error("Error fetching congress bills:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch congress bills",
        });
    }
});
