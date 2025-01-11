<script lang="ts">
    import "../app.css";
    import "../global.css";
    import {AppShell, type ModalComponent} from "@skeletonlabs/skeleton";
    import LeftMenu from "$lib/components/layout/leftMenu/LeftMenu.svelte";
    import { onMount } from "svelte";
    import { loadClasses, loadCoreSkills } from "$lib/helpers/Gameplay";
    import { characters } from "$lib/stores/characters";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import { supabase } from "$lib/db/client";
    import type { AuthSession, RealtimeChannel } from "@supabase/supabase-js";
    import Account from "$lib/components/auth/Account.svelte";
    import Auth from "$lib/components/auth/Auth.svelte";
    import { initializeStores, Toast, Modal } from "@skeletonlabs/skeleton";
    import JoinModal from "$lib/components/sessions/JoinModal.svelte";

    import { getToastStore } from '@skeletonlabs/skeleton';
    import {data} from "autoprefixer";
    import SessionBanner from "$lib/components/layout/sessionBanner/SessionBanner.svelte";

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

    const modalRegistry: Record<string, ModalComponent> = {
        joinSession: { ref: JoinModal }
    };

   

    const handleInserts = () => {
        console.log("handle inserts");
    }

    onMount(() => {
        let characterSubscription: RealtimeChannel;
        let gameSessionSubscription: RealtimeChannel;
        let sessionCharacterSubscription: RealtimeChannel;

        async function updateSessionBanner() {
            if (!session?.user.id) return;

            const { data, error } = await supabase
                .from('sessions_characters')
                .select(`
                    id,
                    is_gm,
                    created_at,
                    game_sessions (
                        id,
                        name,
                        finished_at
                    ),
                    Characters (
                        id,
                        Name
                    )
                `)
                .eq('Characters.ProfileId', session.user.id)
                .is('game_sessions.finished_at', null)
                .single();

            if (error) {
                console.error('Error fetching session data:', error);
                console.log('Current user ID:', session.user.id);

                // Debug query to check character
                const characterCheck = await supabase
                    .from('Characters')
                    .select('*')
                    .eq('ProfileId', session.user.id);
                console.log('Character check:', characterCheck);

                // Debug query to check sessions_characters
                const sessionCheck = await supabase
                    .from('sessions_characters')
                    .select('*');
                console.log('Sessions check:', sessionCheck);

                sessionBanner.set(null);
                return;
            }

            if (data) {
                sessionBanner.set({
                    showBanner: true,
                    sessionName: data.game_sessions.name,
                    sessionId: data.game_sessions.id,
                    characterId: data.Characters.id,
                    characterName: data.Characters.Name,
                    isGm: data.is_gm,
                    sessionCharacterId: data.id,
                    createdAt: new Date(data.created_at)
                });
            } else {
                sessionBanner.set(null);
            }
        }

        async function init() {
            const { data: sessionData } = await supabase.auth.getSession();
            session = sessionData.session;

            supabase.auth.onAuthStateChange((_event, _session) => {
                session = _session;
            });

            if (session?.user.id) {
                // Initial session banner update
                await updateSessionBanner();

                // Game sessions subscription
                gameSessionSubscription = supabase
                    .channel('game_session_changes')
                    .on(
                        'postgres_changes',
                        {
                            event: '*', // Listen to all events
                            schema: 'public',
                            table: 'game_sessions'
                        },
                        async (payload: { new: GameSession; old?: GameSession }) => {
                            if (payload.old) {
                                // Handle updates (e.g., session finished)
                                await updateSessionBanner();
                            } else {
                                // Handle new session creation
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
                        }
                    )
                    .subscribe((status) => console.log('Game session subscription status:', status));

                // Sessions-characters subscription
                sessionCharacterSubscription = supabase
                    .channel('session_character_changes')
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'sessions_characters',
                            filter: `character_id=in.(select id from "Characters" where "ProfileId"=eq.${session.user.id})`
                        },
                        async () => {
                            await updateSessionBanner();
                        }
                    )
                    .subscribe((status) => console.log('Session character subscription status:', status));

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

            // Character subscription
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
            sessionCharacterSubscription?.unsubscribe();
        };
    });
</script>

<Toast />
<Modal components={modalRegistry} />

{#if $sessionBanner?.showBanner}
    <SessionBanner session={session}/>
    {/if}

{#if session }
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

{:else}
    <div class="flex justify-center items-center h-full">
        <Auth />
    </div>
{/if}
