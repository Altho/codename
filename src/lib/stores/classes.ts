import type {
  BuiltClass,
  CoreSkillsCategoriesWithSkills,
} from "$lib/types/TGameplay";
import { persisted } from "svelte-persisted-store";

export const classesStore = persisted<BuiltClass[]>("classes", []);

export const coreSkillsStore = persisted<CoreSkillsCategoriesWithSkills[]>(
  "coreSkills",
  [],
);
