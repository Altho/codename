<script lang="ts">
    import {onMount} from "svelte";
    import {supabase} from "$lib/db/client";
    import { Lock } from 'lucide-svelte';
    import {sessionBanner} from "$lib/stores/sessionBanner";

    import type {AuthSession, RealtimeChannel} from "@supabase/supabase-js";
    import {characters} from "$lib/stores/characters";
    import {type Writable, writable} from "svelte/store";
    import {Plus} from "lucide-svelte";
    import {sessionBeingJoined} from "$lib/stores/session";
    import {getModalStore, type ModalSettings} from "@skeletonlabs/skeleton";

    const modalStore = getModalStore();


    type Session = {
        id: string;
        created_at: string;
        name: string;
        finished_at: string | null;
        private: boolean;
        password: string;
        owner: string;
        Profiles: {
            Username: string;
        };
    };

    const modal: ModalSettings = {
        type: 'component',
        component: 'joinSession',
    };

    export const sessions: Writable<Session[]> = writable([]);

    let session: AuthSession | null;

    interface GameSession {
        id: string;
        owner: string;
    }

    const handleClick = async (id: string, locked: boolean, sessionName: string) => {
        sessionBeingJoined.update(current => ({
            ...current,
            id,
            locked,
            sessionName

        }));
        modalStore.trigger(modal);
    }


    onMount(async () => {
        supabase.auth.getSession().then(({data}) => {
            session = data.session;
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
        });

        const {data, error} = await supabase
            .from("game_sessions")
            .select(`
            *,
            Profiles!inner (
                Username
            )
        `)
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

{#if ($sessionBanner)}
    <div class="container  mx-auto p-8 space-y-8">
        <aside class="alert variant-ghost">
            <div class="alert-message">
                <h3 class="h3">Existing session</h3>
                <p>You're already enrolled in a session. Leave the current session to join a new one</p>
            </div>
        </aside>
    </div>
{:else}

<div class="container mx-auto p-8 space-y-8">
    <h1 class="h1">Current sessions</h1>

    <table class="min-w-full divide-y divide-gray-700">
        <thead class="bg-gray-800/75">
        <tr>
            <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-300"
            >Name
            </th
            >
            <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-300"
            >Created at
            </th
            >
            <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-300"
            >Created By
            </th
            >
            <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-300"
            >Access
            </th
            >
            <th
                    class="px-4 py-3 text-left text-sm font-medium text-gray-300"
            >
            </th
            >
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-700 bg-gray-900/50">
        {#each $sessions as s}
            <tr
                    class="hover:bg-gray-800/50 transition-colors duration-150"
            >

                    <td class="px-4 py-3 text-sm text-gray-300">
                        {s.name}
                    </td>

                <td class="px-4 py-3 text-sm text-gray-300 ">
                    {s.created_at}
                </td>
                <td class="px-4 py-3 text-sm text-gray-300">{s.Profiles.Username}</td>
                <td class="px-4 py-3 text-sm text-gray-300"
                > {#if s.private}
                    <Lock />
                {/if}</td
                >

                <td class="px-4 py-3 text-sm text-gray-300"><button class="btn variant-ghost-primary" on:click={() => {handleClick(s.id, s.private, s.name)}}>Join</button></td>
            </tr>
        {/each}
        </tbody>
    </table>

</div>

    {/if}
