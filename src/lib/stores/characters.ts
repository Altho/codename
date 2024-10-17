import { persisted } from 'svelte-persisted-store';

export const characters = persisted('characters', []);
