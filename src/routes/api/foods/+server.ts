import type { RequestHandler } from "./$types";


export const POST: RequestHandler = async (req) => {
    const data = await req.request.json();
    const response = await fetch("https://fdc.nal.usda.gov/portal-data/external/search", {
        "headers": {
            "Content-Type": "application/json",
        },
        "body": JSON.stringify({
            includeDataTypes: {
                'Survey (FNDDS)': true,
                Foundation: true,
                Branded: true,
                'SR Legacy': true,
                Experimental: true
            },
            referenceFoodsCheckBox: true,
            requireAllWords: true,
            sortCriteria: { sortColumn: 'description', sortDirection: 'asc' },
            generalSearchInput: data['term'],
            pageNumber: data['page'],
            exactBrandOwner: null,
            currentPage: data['page']
        }),
        "method": "POST",
    });

    return response;
};

export const GET: RequestHandler = async (req) => {
    const r = await fetch(`https://fdc.nal.usda.gov/portal-data/external/${req.url.searchParams.get('id')}`, {
        method: 'GET',
    });

    return r;
};