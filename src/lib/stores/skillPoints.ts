import { writable } from 'svelte/store';
import type {CharacterSkills} from "$lib/types/TGameplay";

export interface SkillPoint {
    SkillId: number;
    Points: number;
    bonus: number;
    other: number;
    syn: number;
    get total(): number;
}

export
interface PointValidation {
    skillId: number;
    points: number;
}

export const skillPointsStore = writable<SkillPoint[]>([]);
export const initialPoints = writable<SkillPoint[]>([]);
export const pointsToValidate = writable<PointValidation[]>([]);

export const remoteCharacterSkills = writable<CharacterSkills>({});
