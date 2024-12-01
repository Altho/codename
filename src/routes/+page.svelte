<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "$lib/db/client";
    import type { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
    import { characters } from "$lib/stores/characters";
    import { type Writable, writable } from "svelte/store";

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
        supabase.auth.getSession().then(({ data }) => {
            session = data.session;
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
        });

        const { data, error } = await supabase
            .from("game_sessions")
            .select(`*`)
            .eq("private", false)
            .is("finished_at", null);

        if (!error) {
            sessions.set(data);
            console.log($sessions);
        } else {
            console.error("Error:", error);
        }

        let gameSessionSubscription: RealtimeChannel;
        gameSessionSubscription = supabase
            .channel("game_session_changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "game_sessions",
                },
                (payload: { new: Session }) => {
                    const newSession: Session = payload.new;
                    sessions.update((currentSessions) => [
                        ...currentSessions,
                        payload.new,
                    ]);
                },
            )
            .subscribe((status) =>
                console.log("Game session subscription status:", status),
            );

        return () => {
            gameSessionSubscription?.unsubscribe();
        };
    });
</script>

<div class="container mx-auto p-8 space-y-8">
    <h1 class="h1">Current public sessions</h1>
    {#each $sessions as s}
        <div class="hover:bg-gray-800/50 transition-colors duration-150 card p-4 ">
            <h2>{s.name}</h2>
            <p>{s.id}</p>
        </div>
    {/each}
</div>
