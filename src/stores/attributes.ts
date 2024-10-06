import { persisted } from 'svelte-persisted-store'
import type {Attribute, Skill} from "../types/TGameplay";
import {bonus, ceilBonus} from "../helpers/SkillFunctions";

// First param `preferences` is the local storage key.
// Second param is the initial value.

const ResistPain: Skill = {
    value: 0,
    name: 'Resist Pain',
    bonus: bonus(0),
    groupBonus: ceilBonus(0),
    levelBonus: ceilBonus(0),
    other: 0,
    total: 0,
    DcEffect: 'toughness'
}

const toughness: Attribute = {
    value: 0,
    name: 'Toughness',
    skills: [ResistPain]
}

export const attributes = persisted('attributes', {
    toughness
})