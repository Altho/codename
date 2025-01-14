<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import {availablePoints} from "$lib/stores/pointsPool";
    import { supabase } from "$lib/db/client";
    import { createEventDispatcher } from 'svelte';
    import { eventBus } from '../../helpers/eventBus';

    import type { RealtimeChannel } from '@supabase/supabase-js';
    import {pointsToValidate} from "$lib/stores/skillPoints";
    import {coreSkillsLoader} from "$lib/stores/loaders";
    import {increaseCoreSkill} from "$lib/helpers/SupabaseFunctions";
    import {ProgressBar} from "@skeletonlabs/skeleton";

    let amount: number | null = null;
    let subscription: RealtimeChannel;


    function handleReset() {
        eventBus.emit('resetSkills');
        fetchAmount();
    }

    async function fetchAmount() {
        if (!$sessionBanner?.characterId || !$sessionBanner?.sessionId) return;

        const { data, error } = await supabase
            .from('coreskill_pools')
            .select('amount')
            .eq('character_id', $sessionBanner.characterId)
            .eq('session_id', $sessionBanner.sessionId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching coreskill pools:', error);
            return;
        }



        amount = data?.amount ?? null;
        updatePointsStore(amount ? amount : 0);
    }

    const updatePointsStore = (amount: number) => {
        availablePoints.set(amount);
    }

    onMount(() => {
        fetchAmount();

        if ($sessionBanner?.characterId && $sessionBanner?.sessionId) {
            subscription = supabase
                .channel('coreskill_pools_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'coreskill_pools',
                        filter: `character_id=eq.${$sessionBanner.characterId} `
                    },
                    (payload) => {
                        console.log('Received realtime update:', payload); 
                        fetchAmount();
                    }
                )
                .subscribe();
        }
    });

    onDestroy(() => {
        subscription?.unsubscribe();
    });

    $: if ($sessionBanner?.characterId && $sessionBanner?.sessionId) {
        fetchAmount();
    }


    const handleCLick = async () => {
        const sessionId = $sessionBanner?.sessionId;
        const characterId = $sessionBanner?.characterId;
        coreSkillsLoader.set(true)
        await increaseCoreSkill($pointsToValidate, characterId, sessionId);
        coreSkillsLoader.set(false)
        handleReset();
        // flash = true;
        // flashingSkillId = skillId;
        // setTimeout(() => {
        //     flashingSkillId = null;
        // }, 500);

    }


</script>


{#if amount !== null}
    <div class="fixed flex flex-col gap-2 top-4 right-8 lg:right-1/6 backdrop-blur-md bg-white/10 p-4 rounded-lg shadow-xl border border-white/20 z-50">
        {#if $coreSkillsLoader}
            <div class="flex gap-2 items-center min-w-[200px] h-[2rem]">
                <ProgressBar meter="bg-green-600" track="bg-green-400" class="w-full" />
            </div>
        {:else}
            <div class="flex gap-2 items-end">
                <h4 class="text-lg font-semibold">Available Points :</h4>
                <p class="text-3xl font-bold p-2.5 bg-slate-800 text-white rounded-lg shadow-md border-2 border-blue-400 inline-flex items-center justify-center min-w-[3rem]">
                    {$availablePoints}
                </p>
            </div>
            {#if ($pointsToValidate.length > 0)}
                <div class="flex gap-2 ">
                    <button on:click={handleReset} class="btn variant-outline-error">Reset</button>
                    <button on:click={handleCLick} class="btn variant-ghost-success">Commit points</button>
                </div>
            {/if}
        {/if}
    </div>
{/if}
