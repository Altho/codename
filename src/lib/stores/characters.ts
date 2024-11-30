import { persisted } from 'svelte-persisted-store';
import {writable} from "svelte/store";

export const characters = persisted('characters', []);

export const characterBeingCreated = writable({name: ''});
