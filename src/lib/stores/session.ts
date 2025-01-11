import { writable } from 'svelte/store';

export const sessionBeingCreated = writable({name: 'session', restricted: false, password: null});

export const sessionBeingJoined = writable({id: '', characterName: '', sessionName: '', password: '', locked: false});