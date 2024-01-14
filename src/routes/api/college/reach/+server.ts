import extraCollegeData from "$lib/data/colleges.json";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (req) => {
    const satScore = parseInt(req.url.searchParams.get('s') || '400');

    return json(extraCollegeData.filter(v => {
        return v.sat_avg && v.sat_avg > satScore + 100;
    }));
}