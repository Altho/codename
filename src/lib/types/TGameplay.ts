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

export type SkillDetails = {
  Points: number;
  Other: number;
  Bonus: number;
}

export type CharacterSkills = {
  [category: string]: {
    [skillName: string]: SkillDetails;
  };
}

export interface Profile {
  id: string;
  Website: string | null;
  isAdmin: boolean;
  FullName: string | null;
  Username: string;
  AvatarUrl: string | null;
  UpdatedAt: string;
}

export interface Character {
  id: number;
  Created_at: string;
  Updated_at: string;
  Name: string;
  ProfileId: string;
  Profiles: Profile;
}

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

type CoreSkill = Database["public"]["Tables"]["Skills"]["Row"] & {
  Synergies: Array<{
    Classes: Database["public"]["Tables"]["Classes"]["Row"];
  }>;
  CoreSkillsCategories: Database["public"]["Tables"]["CoreSkillsCategories"]["Row"];
};

export type CoreSkillsCategoriesWithSkills =
  Database["public"]["Tables"]["CoreSkillsCategories"]["Row"] & {
    Skills: CoreSkill[];
  };
