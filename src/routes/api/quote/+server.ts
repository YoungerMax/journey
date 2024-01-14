import { fail, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export interface Quote {
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

async function getQuote(symbol: string) {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&crumb=ANqXaAeJ6Fe&lang=en-US&region=US&symbols=${symbol}&corsDomain=finance.yahoo.com`;
    const r = await fetch(url);
    console.log(r);
    const data = await r.json();
    const d = data['quoteResponse']['result'][0];

    return toQuote(d);
}

export const GET: RequestHandler = async (r) => {
    let s = r.url.searchParams.get('symbol');
    if (s === null || s.length == 0) {
        fail(400);

        return json({});
    }

    return json(getQuote(s));
};