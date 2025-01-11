<script lang="ts">
    import {supabase} from "$lib/db/client";
    import {availablePoints} from "$lib/stores/pointsPool";
    import {onDestroy, onMount} from "svelte";
    import type {RealtimeChannel} from "@supabase/supabase-js";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import CharacterCard from "$lib/components/sessions/CharacterCard.svelte";
    import Chat from "$lib/components/sessions/Chat.svelte";

    let subscription: RealtimeChannel;

    let characters: any[] = [];  // Initialize as array
    $: characters

    async function fetchCharacters() {
        const { data, error } = await supabase
            .from('sessions_characters')
            .select(`
            character_id, is_gm,
            Characters (*)
        `)
            .eq('session_id', $sessionBanner?.sessionId);

        if (error) {
            console.error('Error fetching characters:', error);
            return;
        }

        characters = data;
        console.log(characters, "characters data");
    }

    onMount(() => {
        fetchCharacters();

        if ($sessionBanner?.sessionId) {
            subscription = supabase
                .channel('sessions_characters_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'sessions_characters',
                        filter: `session_id=eq.${$sessionBanner.sessionId}`
                    },
                    () => {
                        fetchCharacters();
                    }
                )
                .subscribe();
        }
    });

    onDestroy(() => {
        subscription?.unsubscribe();
    });
</script>

<div class="container mx-auto p-4">
    <div class="flex flex-wrap gap-4">
        {#each characters as character (character.Characters.id)}
            <CharacterCard playerCharacter={character} />
        {/each}
    </div>
</div>

<Chat />