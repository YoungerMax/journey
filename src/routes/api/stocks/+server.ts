import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

interface Quote {
    name: string;
    currency: string;
    exchange: string;
    analystRating: string;
    symbol: string;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    price: string;
    percentChange: number;
}

function toQuote(data: any): Quote {
    return {
        name: data['shortName'],
        analystRating: data['averageAnalystRating'],
        currency: data['financialCurrency'],
        exchange: data['fullExchangeName'],
        fiftyTwoWeekLow: data['fiftyTwoWeekLow'],
        fiftyTwoWeekHigh: data['fiftyTwoWeekHigh'],
        price: data['regularMarketPrice'],
        symbol: data['symbol'],
        percentChange: data['regularMarketChangePercent']
    };
}

async function loadSaved(type: string) {
    const url = `https://query2.finance.yahoo.com/v1/finance/screener/predefined/saved?formatted=false&lang=en-US&region=US&scrIds=${type}&count=5&enableSectorIndustryLabelFix=true&corsDomain=finance.yahoo.com`;
    const data = await (await fetch(url)).json();
    const d = data['finance']['result'][0];

    return {
        name: d['title'],
        asOf: d['lastUpdated'],
        quotes: d['quotes'].map(toQuote)
    }
}

export const GET: RequestHandler = async () => {
    return json({
        mostActive: await loadSaved('most_actives'),
        dayGainers: await loadSaved('day_gainers'),
        dayLosers: await loadSaved('day_losers'),
        cryptocurrencies: await loadSaved('all_cryptocurrencies_us')
    });
};