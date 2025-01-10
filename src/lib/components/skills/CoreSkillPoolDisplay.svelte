<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import {availablePoints} from "$lib/stores/pointsPool";
    import { supabase } from "$lib/db/client";
    import type { RealtimeChannel } from '@supabase/supabase-js';

    let amount: number | null = null;
    let subscription: RealtimeChannel;

    async function fetchAmount() {
        if (!$sessionBanner?.characterId) return;

        const { data, error } = await supabase
            .from('coreskill_pools')
            .select('amount')
            .eq('character_id', $sessionBanner.characterId)
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

        if ($sessionBanner?.characterId) {
            subscription = supabase
                .channel('coreskill_pools_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'coreskill_pools',
                        filter: `character_id=eq.${$sessionBanner.characterId}`
                    },
                    () => {
                        fetchAmount();
                    }
                )
                .subscribe();
        }
    });

    onDestroy(() => {
        subscription?.unsubscribe();
    });

    $: if ($sessionBanner?.characterId) {
        fetchAmount();
    }
</script>

{#if amount !== null}
    <div class="fixed top-4 right-12 bg-surface-100-800-token p-4 rounded-lg shadow-lg border border-surface-300-600-token z-50">
        <div class="flex flex-col items-center">
            <h4 class="text-lg font-semibold mb-1">Available Points</h4>
            <p class="text-2xl font-bold">{$availablePoints}</p>
        </div>
    </div>
{/if}