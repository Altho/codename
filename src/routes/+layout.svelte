<script lang="ts">
	import '../app.css';
	import '../global.css';
	import { AppShell } from '@skeletonlabs/skeleton';
	import LeftMenu from '$lib/components/layout/leftMenu/LeftMenu.svelte';
	import { onMount } from 'svelte';
	import { characters } from '$lib/stores/characters';
	import { supabase } from '$lib/db/client';
	import type { AuthSession } from '@supabase/supabase-js';
	import Account from '$lib/components/auth/Account.svelte';
	import Auth from '$lib/components/auth/Auth.svelte';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();

	let session: AuthSession | null;

	onMount(async () => {
		const { data: sessionData } = await supabase.auth.getSession();
		session = sessionData.session;

		supabase.auth.onAuthStateChange((_event, _session) => {
			session = _session;
		});

		if (session?.user.id) {
			const { data, error } = await supabase
				.from('characters')
				.select(
					`
                *,
                profiles!inner(*)
            `
				)
				.eq('profiles.id', session.user.id);

			if (!error) {
				console.log(data);
				characters.set(data ?? data);
				console.log($characters);
			} else {
				console.error('Error:', error);
			}
		} else {
			console.log('No session available');
		}
		console.log($characters.length);
	});
</script>

<Toast />

{#if !session}
	<div class="flex justify-center items-center h-full">
		<Auth />
	</div>
{/if}

{#if $characters.length === 0}
	<div class="flex justify-center items-center h-full">
		You don't have any character --- Create character Create DM Profile ---
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

		<slot />

		<!-- ---- / ---- -->
		<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
		<!-- (footer) -->
	</AppShell>
{/if}
