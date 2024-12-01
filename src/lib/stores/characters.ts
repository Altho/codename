import { persisted } from 'svelte-persisted-store';
import {writable} from "svelte/store";
import type {Character} from "$lib/types/TGameplay";

export const characters = persisted('characters', []);

export const characterBeingCreated = writable({name: ''});

export const selectedCharacter = persisted<Character | null>('selectedCharacter', null);
