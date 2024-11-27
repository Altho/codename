import { persisted } from 'svelte-persisted-store'
import type {Attribute, Skill} from "../types/TGameplay";
import {bonus, groupBonus, levelBonus} from "../helpers/SkillFunctions";



const resistPain: Skill = {
    value: 5,
    name: 'Resist Pain',
    bonus: function() {
        return bonus(this.value)
    },
    groupBonus: function() {
        return groupBonus(this.value)
    },
    levelBonus: function() {
        return levelBonus(this.value)
    },
    other: 0,
    get total() {
        return this.bonus() + this.groupBonus() + this.levelBonus() + this.other;
    },
    DcEffect: 'Prevent loss of skill from wounds'
}

const resistStun: Skill = {
    value: 0,
    name: 'Resist Stun',
    bonus: function() {
        return bonus(this.value)
    },
    groupBonus: function() {
        return groupBonus(this.value)
    },
    levelBonus: function() {
        return levelBonus(this.value)
    },
    other: 0,
    get total() {
        return this.bonus() + this.groupBonus() + this.levelBonus() + this.other;
    },
    DcEffect: 'Prevent loss of action speed on hit'
}

const toughness: Attribute = {
    value: 0,
    name: 'Toughness',
    skills: [resistPain, resistStun]
}

export const attributes = persisted('attributes', [
    toughness
])