export type Dice = {
  value: number;
  name: string;
  amount: number;
  triggerEffect: number;
};

export interface CastResult {
  value: number;
  didTriggerEffect: boolean;
  effectAmount: number;
}

export type Attribute = {
  value: number;
  name: string;
  skills: Skill[];
};

export type Skill = {
  value: number;
  name: string;
  bonus: () => number;
  groupBonus: () => number;
  levelBonus: () => number;
  other: number;
  total: number;
  DcEffect: string;
};

// export interface StoredClass extends Classes {
//     isTwoTimes: boolean;
//     bonusAmount: number;
//     affectedCategory: string; //TODO: Add an enum
// }

// export type uniqueBonus = {

// // }
