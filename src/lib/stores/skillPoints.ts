import { writable } from 'svelte/store';

interface SkillPoint {
    SkillId: number;
    Points: number;
}

export const skillPointsStore = writable<SkillPoint[]>([]);