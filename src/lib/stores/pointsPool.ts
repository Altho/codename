import {persisted} from "svelte-persisted-store";


export const availablePoints = persisted<number>('availablePoints', 0)