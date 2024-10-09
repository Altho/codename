import { persisted } from 'svelte-persisted-store'
import type {Attribute, Skill} from "../types/TGameplay";
import {bonus, groupBonus, levelBonus} from "../helpers/SkillFunctions";

// First param `preferences` is the local storage key.
// Second param is the initial value.

const resistPain: Skill = {
    value: 0,
    name: 'Resist Pain',
    bonus: () => bonus(this.value),
    groupBonus: () => groupBonus(this.value),
    levelBonus: () => levelBonus(this.value),
    other: 0,
    total: 0,
    DcEffect: 'Prevent loss of skill from wounds'
}

const resistStun: Skill = {
    value: 0,
    name: 'Resist Pain',
    bonus: () => bonus(this.value),
    groupBonus: () => groupBonus(this.value),
    levelBonus: () => levelBonus(this.value),
    other: 0,
    total: 0,
    DcEffect: 'Prevent loss of action speed on hit'
}

const toughness: Attribute = {
    value: 0,
    name: 'Toughness',
    skills: [resistPain, resistStun]
}

export const attributes = persisted('attributes', {
    toughness
})