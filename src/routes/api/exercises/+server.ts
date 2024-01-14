import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import exercises from "$lib/data/exercises.json";

const groups = [
    exercises.Abdominals,
    exercises.Biceps,
    exercises.Chest,
    
    exercises.Lats,
    exercises["Middle Back"],
    exercises["Lower Back"],

    exercises.Shoulders,
    exercises.Quadriceps,
    exercises.Triceps
];

const groupNames = [
    'Abs',
    'Biceps',
    'Chest',
    'Lats',
    'Middle Back',
    'Lower Back',
    'Shoulders',
    'Quads',
    'Triceps'
];

export interface Exercise {
    name: string;
    reps: number;
    sets: number;
    desc: string;
    type: string;
    equipment: string;
    level: string;
    group: string;
}

export const GET: RequestHandler = async () => {
    let d: Exercise[][] = [];

    for (let i = 0; 5 > i; i++) {
        let day: Exercise[] = [];

        for (let groupIdx = 0; groups.length > groupIdx; groupIdx++) {
            let group = groups[groupIdx];
            let idx = Math.floor(Math.random() * group.length);
            let exercise = group[idx];

            day.push({
                reps: 12,
                sets: 2,
                desc: exercise.desc,
                equipment: exercise.equipment,
                level: exercise.level,
                name: exercise.title,
                type: exercise.type,
                group: groupNames[groupIdx]
            });
        }

        d.push(day);
    }

    return json(d);
};