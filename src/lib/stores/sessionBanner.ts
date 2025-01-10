import {persisted} from "svelte-persisted-store";

interface SessionBanner {
    showBanner: boolean;
    sessionName: string;
    sessionId: string, 
    characterName: string;
    characterId: number;
    sessionCharacterId: number;  // Add this to store the sessions_characters entry id
    isGm: boolean;
    createdAt: Date;
}


export const sessionBanner = persisted<SessionBanner | null>('sessionBanner', null)