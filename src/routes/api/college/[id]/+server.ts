import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import type { College } from "../+server";
import extraCollegeData from "$lib/data/colleges.json";

function chanceMe(college: College, satReading: number, satMath: number, weightedGPA: number) {
    // TODO: better chancer
    const r25 = college["SAT Critical Reading 25th Percentile"];
    const r75 = college["SAT Critical Reading 75th Percentile"];
    const ra = (r25 + r75) / 2;
    const m25 = college["SAT Math 25th Percentile"];
    const m75 = college["SAT Math 75th Percentile"];
    const ma = (m25 + m75) / 2;
    const avgScore = (ra + ma) / 2;
    
    const score = satReading + satMath;

    return Math.min(99, Math.floor((score / avgScore) * 100 * (college["Admissions Total"] / college["Applicants Total"])));
}

async function getCollege(dataUsaId: string) {
    const url = `https://embed.datausa.io/api/data?University=${dataUsaId}&measures=SAT%20Critical%20Reading%2025th%20Percentile,SAT%20Critical%20Reading%2075th%20Percentile,SAT%20Math%2025th%20Percentile,SAT%20Math%2075th%20Percentile,State%20Tuition,Admissions%20Total,Applicants%20Total,University`;
    const d = await (await fetch(url)).json();

    let arr: object[] = d['data'];
    const allData = arr.find((v) => {
        for (let key of Object.keys(v)) {
            if (!v[key]) return false;
        }
        return true;
    });
    const name = allData['University'].replace(`(${dataUsaId})`, '').trim();
    const moreData = extraCollegeData.find(v => v.name === name);

    return {
        ...allData,
        ...moreData
    };
}

export const GET: RequestHandler = async (req) => {
    return json(await getCollege(req.params.id));
}

export const POST: RequestHandler = async (req) => {
    const c: College = await getCollege(req.params.id);
    const rw = parseInt(req.url.searchParams.get('rw') || '200') ;
    const math = parseInt(req.url.searchParams.get('math') ||'200') ;
    const weightedGPA = parseFloat(req.url.searchParams.get('gpa') ||'2.0');

    console.log(rw, math, weightedGPA);

    let out = {
        'chance': chanceMe(c, rw, math, weightedGPA)
    };

    console.log(out);

    return json(out);
}