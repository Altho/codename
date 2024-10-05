export type Dice = {
    value: number;
    name: string;
    amount: number;
}

export type CastResult = {
    value: number;
    didTriggerEffect: boolean;
    EffectAmount: number;
}

export type SkillEffect = {
    isTwoTimes: boolean;
    bonusAmount: number;
    affectedCategory: string; //TODO: Add an enum
}
