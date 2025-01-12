<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/db/client";
    import type { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import { characters } from "$lib/stores/characters";
    import { type Writable, writable } from "svelte/store";
    import {goto} from "$app/navigation";

    type Session = {
        id: string;
        created_at: string;
        name: string;
        finished_at: string | null;
        private: boolean;
        password: string;
        owner: string;
    };

    export const sessions: Writable<Session[]> = writable([]);

    let session: AuthSession | null;

    interface GameSession {
        id: string;
        owner: string;
    }

    onMount(async () => {
        if ($sessionBanner && $sessionBanner.sessionId) {
            goto('/session')
            return
        }


    });
</script>

<div class="container mx-auto p-8 space-y-8">
    <a href="./session/join">[Join Session}</a>
    <br />
    <a href="./session/new">[Create Session}</a>
</div>
