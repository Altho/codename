<script lang="ts">
    import "../app.css";
    import "../global.css";
    import { AppShell } from "@skeletonlabs/skeleton";
    import LeftMenu from "$lib/components/layout/leftMenu/LeftMenu.svelte";
    import { onMount } from "svelte";
    import { loadClasses, loadCoreSkills } from "$lib/helpers/Gameplay";
    import { characters } from "$lib/stores/characters";
    import { supabase } from "$lib/db/client";
    import type { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
    import Account from "$lib/components/auth/Account.svelte";
    import Auth from "$lib/components/auth/Auth.svelte";
    import { initializeStores, Toast } from "@skeletonlabs/skeleton";
    import CoreSkills from "$lib/components/skills/CoreSkills.svelte";
    import { coreSkillsStore } from "$lib/stores/classes";
    import { getToastStore } from '@skeletonlabs/skeleton';
    import {data} from "autoprefixer";

    interface Profile {
        username: string;
        id: string;
    }

    interface GameSession {
        id: string;
        owner: string;
    }

    initializeStores();
    const toastStore = getToastStore();
    let session: AuthSession | null = null;
    let subscription: RealtimeChannel;
    
    const handleInserts = () => {
        console.log("handle inserts");
    }

    onMount(() => {
        let characterSubscription: RealtimeChannel;
        let gameSessionSubscription: RealtimeChannel;

        async function init() {
            const { data: sessionData } = await supabase.auth.getSession();
            session = sessionData.session;

            supabase.auth.onAuthStateChange((_event, _session) => {
                session = _session;
            });

            

            if (session?.user.id) {
                gameSessionSubscription = supabase
                    .channel('game_session_changes')
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'game_sessions'
                        },
                        async (payload: { new: GameSession }) => {
                            console.log("insert")
                            const { data: profile } = await supabase
                                .from('Profiles')
                                .select('Username')
                                .eq('id', payload.new.owner)
                                .single();

                            toastStore.trigger({
                                message: `${(profile).Username} created a new game session`,
                                background: 'variant-ghost-tertiary'
                            });
                        }
                    )
                    .subscribe((status) => console.log('Game session subscription status:', status));

                await loadClasses();
                await loadCoreSkills();

                const { data, error } = await supabase
                    .from("Characters")
                    .select(`*, Profiles!inner(*)`)
                    .eq("Profiles.id", session.user.id);

                if (!error) {
                    characters.set(data ?? data);
                } else {
                    console.error("Error:", error);
                }
            } else {
                console.log("No session available");
            }

            characterSubscription = supabase
                .channel('character_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'Characters',
                        filter: `ProfileId=eq.${session.user.id}`
                    },
                    async (payload: { new: any }) => {
                        characters.update(currentCharacters => [...currentCharacters, payload.new]);
                        
                    }
                )
                .subscribe((status) => console.log('Character subscription status:', status));
        }

        init();

        return () => {
            characterSubscription?.unsubscribe();
            gameSessionSubscription?.unsubscribe();
        };
    });
</script>

<Toast />

{#if session && $characters.length != 0}
    <AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
        <svelte:fragment slot="header"></svelte:fragment>
        <svelte:fragment slot="sidebarLeft">
            <LeftMenu />
        </svelte:fragment>
        <!-- (sidebarRight) -->
        <!-- (pageHeader) -->
        <!-- Router Slot -->

        <slot />

        <!-- ---- / ---- -->
        <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
        <!-- (footer) -->
    </AppShell>
{:else if session && $characters.length == 0}
    <div class="flex justify-center items-center h-full">
        You don't have any character --- Create character Create DM Profile ---
    </div>
{:else}
    <div class="flex justify-center items-center h-full">
        <Auth />
    </div>
{/if}
