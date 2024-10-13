<script lang="ts">import "../app.css";
import '../global.css'
import {AppShell} from "@skeletonlabs/skeleton";
import LeftMenu from "$lib/components/layout/leftMenu/LeftMenu.svelte";
import { onMount } from 'svelte'
import { supabase } from '$lib/db/client'
import type { AuthSession } from '@supabase/supabase-js'
import Account from '$lib/components/auth/Account.svelte'
import Auth from '$lib/components/auth/Auth.svelte'
import { initializeStores, Toast } from '@skeletonlabs/skeleton';

initializeStores();

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

<Toast />

{#if !session}
    <div class="flex justify-center items-center h-full">
    <Auth />
    </div>
{:else}
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
    <svelte:fragment slot="header"></svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <LeftMenu />
    </svelte:fragment>
    <!-- (sidebarRight) -->
    <!-- (pageHeader) -->
    <!-- Router Slot -->



        <slot/>



    <!-- ---- / ---- -->
    <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
    <!-- (footer) -->
</AppShell>
{/if}
