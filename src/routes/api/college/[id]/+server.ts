import { json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import type { College } from "../+server";
import extraCollegeData from "$lib/data/colleges.json";

function chanceMe(college: College, satReading: number, satMath: number, weightedGPA: number) {
    const satReadingPercentile = (satReading - college["SAT Critical Reading 25th Percentile"]) /
        (college["SAT Critical Reading 75th Percentile"] - college["SAT Critical Reading 25th Percentile"]);

    const satMathPercentile = (satMath - college["SAT Math 25th Percentile"]) /
        (college["SAT Math 75th Percentile"] - college["SAT Math 25th Percentile"]);

    const gpaPercentile = weightedGPA / 4;

    // Calculate overall admission chance based on percentiles
    const admissionChance = (satReadingPercentile + satMathPercentile + gpaPercentile) / 3;

    return admissionChance;
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
    const body = await req.request.json();
    const rw = parseInt(body['rw']) || 200;
    const math = parseInt(body['math']) || 200;
    const weightedGPA = parseFloat(body['gpa']) || 2.0;

    return json({
        'chance': chanceMe(c, rw, math, weightedGPA)
    });
}