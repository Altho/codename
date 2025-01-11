<script lang="ts">
    import { getToastStore } from '@skeletonlabs/skeleton';
    import type { AuthSession } from '@supabase/supabase-js';
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import {supabase} from "$lib/db/client";
    import {goto} from "$app/navigation";

    export let session: AuthSession | null = null;
    const toastStore = getToastStore();

    async function handleLeaveSession() {
        if (!session?.user.id || !$sessionBanner) return;

        try {
            console.log($sessionBanner.sessionCharacterId)
            const { error: deleteError } = await supabase
                .from('sessions_characters')
                .delete()
                .eq('id', $sessionBanner.sessionCharacterId);

            if (deleteError) {
                console.error('Error leaving session:', deleteError);
                toastStore.trigger({
                    message: 'Error leaving session',
                    background: 'variant-filled-error'
                });
                return;
            }

            toastStore.trigger({
                message: `Left session: ${$sessionBanner.sessionName}`,
                background: 'variant-filled-success'
            });

            sessionBanner.set(null);
            goto('/')
        } catch (error) {
            console.error('Error in handleLeaveSession:', error);
            toastStore.trigger({
                message: 'An unexpected error occurred',
                background: 'variant-filled-error'
            });
        }
    }
</script>

<button
        class="btn variant-filled-error"
        on:click={handleLeaveSession}
        disabled={!$sessionBanner}
>
    Leave Session
</button>