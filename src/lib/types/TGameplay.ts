import type { Database } from "./database.types";

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

export type BuiltClass = Database["public"]["Tables"]["Classes"]["Row"] & {
  SituationalBonuses: Database["public"]["Tables"]["SituationalBonuses"]["Row"][];
  UniqueBonuses: Database["public"]["Tables"]["UniqueBonuses"]["Row"][];
  TRC: Database["public"]["Tables"]["TRC"]["Row"][];
  SPC: Database["public"]["Tables"]["SPC"]["Row"][];
  ClassesEffect: Array<{
    CriticalEffects: {
      id: number;
      Name: string;
      DcEffect: string;
      TriggeredOn: string;
      Scales: Database["public"]["Tables"]["Scales"]["Row"];
      BonusFor: Database["public"]["Tables"]["BonusFor"]["Row"];
    };
  }>;
};
