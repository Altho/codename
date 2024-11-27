<script lang="ts">
    import type { AuthSession } from '@supabase/supabase-js'
import Account from "$lib/components/auth/Account.svelte";
import {supabase} from "$lib/db/client.js";
import {onMount} from "svelte";
    import Auth from "$lib/components/auth/Auth.svelte";

    let session: AuthSession | null

onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
        session = data.session
    })

    supabase.auth.onAuthStateChange((_event, _session) => {
        session = _session
    })
})
</script>

{#if !session}
    Access denied
{:else}
    <div class="container mx-auto p-8 space-y-8">
    <Account {session} />
    </div>
{/if}