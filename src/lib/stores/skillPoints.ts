import { writable } from 'svelte/store';

interface SkillPoint {
    SkillId: number;
    Points: number;
    bonus: number;
    other: number;
    syn: number;
    get total(): number;
}

export const skillPointsStore = writable<SkillPoint[]>([]);