

<script lang="ts">
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import { Crown } from 'lucide-svelte';
    import type {AuthSession} from "@supabase/supabase-js";
    import LeaveSessionButton from "$lib/components/sessions/LeaveSessionButton.svelte";

    export let session: AuthSession | null = null;

    // Format date to be more readable
    $: formattedDate = $sessionBanner?.createdAt
        ? new Date($sessionBanner.createdAt).toLocaleString()
        : '';
</script>

<div class="fixed bottom-0 left-0 w-full bg-surface-100-800-token p-4 shadow-lg border-t border-surface-300-600-token z-50">
    <div class="container mx-auto flex justify-between items-center max-w-3xl">
        <div class="flex flex-col">
            <div class="flex items-center gap-2">
                <h3 class="h3">{$sessionBanner?.sessionName}</h3>
                {#if $sessionBanner?.isGm}
                    <Crown class="h-5 w-5 text-yellow-500" />
                {/if}
            </div>
            <p class="text-surface-600-300-token">{$sessionBanner?.characterName}</p>
        </div>
        <div class="flex items-center gap-4">
            <div class="flex flex-col items-end">
                <p class="text-surface-600-300-token text-sm">Started</p>
                <p class="text-surface-600-300-token">{formattedDate}</p>
                <p class="text-surface-600-300-token text-xs">{$sessionBanner?.sessionId}</p>
            </div>
            <LeaveSessionButton {session} />
        </div>
    </div>
</div>