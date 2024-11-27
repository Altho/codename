import type { BuiltClass } from "$lib/types/TGameplay";
import { persisted } from "svelte-persisted-store";

export const classesStore = persisted<BuiltClass[]>("classes", []);
