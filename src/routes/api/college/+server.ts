import type { RequestHandler } from "./$types";
import extraCollegeData from "$lib/data/colleges.json";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async (req) => {
    const q = req.url.searchParams.get('q') || '';
    const p = new URLSearchParams({
        'limit': '100',
        'dimension': 'University',
        'q': q
    });


    const d = await (await fetch("https://datausa.io/api/searchLegacy/?"+p)).json();
    let results = d['results'].filter(r => r.hierarchy === 'University');

    return json(results.map(r => {
        return {
            'id': r['id'],
            'name': r['name'],
            'slug': r['slug'],
            'score': r['zvalue']
        }
    }));
}

export type College = {
    "ID Year": number;
    "Year": string;
    "ID University": string;
    "University": string;
    "SAT Critical Reading 25th Percentile": number;
    "SAT Critical Reading 75th Percentile": number;
    "SAT Math 25th Percentile": number;
    "SAT Math 75th Percentile": number;
    "Admissions Total": number;
    "Applicants Total": number;
    "Slug University": string;
    "State Tuition": number;
    "id": string;
    "name": string;
    "city": string;
    "state": string;
    "addr": string;
    "zip": string;
    "url": string;
    "students": number;
    "salary_after_school": number;
};
