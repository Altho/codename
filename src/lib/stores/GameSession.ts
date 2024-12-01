import { writable } from 'svelte/store';
import { supabase } from "$lib/db/client";
import {persisted} from "svelte-persisted-store";

interface Session {
    id: string;
    created_at: string;
    finished_at: string | null;
    name: string;
    owner: string;
    password: string;
    private: boolean;
}

export const currentSession = persisted<Session | null>('currentSession', null)