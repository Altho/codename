export type Dice = {
    value: number;
    name: string;
    amount: number;
    triggerEffect: number;
}



export interface CastResult {
    value: number;
    didTriggerEffect: boolean;
    effectAmount: number;
}

export type SkillEffect = {
    isTwoTimes: boolean;
    bonusAmount: number;
    affectedCategory: string; //TODO: Add an enum
}
