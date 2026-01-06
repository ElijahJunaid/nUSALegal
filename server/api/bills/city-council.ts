// Dados estáticos dos bills do city council
export const cityCouncilBills = [
    {
        number: "Ordinance No. 0018",
        description:
            "Establishes budget allocation for municipal employee performance bonuses.",
        pdfPath: "dcbills/Ordinance No. 0018.pdf",
        type: "ordinance",
        category: "city-council",
    },
    {
        number: "Ordinance No. 0020",
        description:
            "Defense of the District and National Sovereignty Act establishing protective measures.",
        pdfPath:
            "dcbills/Ord_No._0020___Defense_of_the_District_and_National_Sovereignty_Act.pdf",
        type: "ordinance",
        category: "city-council",
    },
    {
        number: "GeorgeGodsent Remembrance Day Act",
        description:
            "Establishes an annual remembrance day honoring GeorgeGodsent's contributions to DC.",
        pdfPath:
            "dcbills/DC City Council _ GeorgeGodsent Remembrance Day Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Independent Counsel Act",
        description:
            "Establishes procedures for appointing independent counsel for investigations.",
        pdfPath:
            "dcbills/Copy of Establishment of an Independent Counsel Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Minor Traffic Infractions Act",
        description:
            "Sets penalties and procedures for handling minor traffic violations.",
        pdfPath: "dcbills/Minor Traffic Infractions and Penalties Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Columbia Defense Force Act",
        description: "Establishes and regulates the Columbia Defense Force.",
        pdfPath: "dcbills/Columbia Defense Force Act of 2024.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Criminal Sanity Preservation Act",
        description:
            "Ordinance 6 establishing mental health protocols in criminal proceedings.",
        pdfPath:
            "dcbills/D.C. City Council Criminal Sanity Preservation Act - Ord 6.pdf",
        type: "ordinance",
        category: "city-council",
    },
    {
        number: "DC Medal of Honor Act",
        description:
            "Establishes criteria and procedures for awarding the DC Medal of Honor.",
        pdfPath: "dcbills/DC City Council _ DC Medal of Honor Act .pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Keeping Transparency Act",
        description:
            "Mandates transparency measures in DC government operations.",
        pdfPath: "dcbills/DC City Council _ Keeping Transparency.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Municipal Job Fairs Act",
        description:
            "Requires regular job fairs for municipal employment opportunities.",
        pdfPath:
            "dcbills/DC City Council _ Municipal Job Fairs Act Revised.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Municipal Resignations Act",
        description:
            "Establishes procedures for municipal employee resignations.",
        pdfPath: "dcbills/DC City Council _ Municipal Resignations Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Arrighi Memorial Day Act",
        description: "Establishes an annual memorial day honoring Arrighi.",
        pdfPath: "dcbills/DC City Council _Arrighi Memorial Day Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Chexburger Domestication Act",
        description:
            "Regulates the domestication and care of Chexburgers in DC.",
        pdfPath:
            "dcbills/DC_City_Council_-_Chexburger_Domestication_Act_of_2024.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Compartmentalized Information Act",
        description:
            "Establishes protocols for handling sensitive information.",
        pdfPath:
            "dcbills/DC_City_Council_-_Compartmentalized_Information_Act_of_2024.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "D.C. Correctional Demarcation Act",
        description:
            "Defines boundaries and jurisdictions for correctional facilities.",
        pdfPath:
            "dcbills/DC_City_Council_-_D.C._Correctional_Demarcation_Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Dagger Act",
        description: "Regulates the possession and use of daggers within DC.",
        pdfPath: "dcbills/DC_City_Council_-_Dagger_Act.pdf",
        type: "act",
        category: "city-council",
    },
    {
        number: "Off-Roading at The Ellipse Act",
        description: "Regulates off-road vehicle activities at The Ellipse.",
        pdfPath: "dcbills/DC_City_Council_-_Off-Roading_at_The_Ellipse_Act.pdf",
        type: "act",
        category: "city-council",
    },
];

export default defineEventHandler(async (event) => {
    validateApiAccess(event, "bills/city-council");

    try {
        return cityCouncilBills;
    } catch (error) {
        console.error("Error fetching city council bills:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to fetch city council bills",
        });
    }
});
