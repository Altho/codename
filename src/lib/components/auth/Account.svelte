<script lang="ts">
    import { onMount } from 'svelte'
    import type { AuthSession } from '@supabase/supabase-js'
    import { supabase } from '$lib/db/client'

    export let session: AuthSession

    let loading = false
    let username: string | null = null
    let website: string | null = null
    let avatarUrl: string | null = null

    onMount(() => {
        getProfile()
    })

    const getProfile = async () => {
        try {
            loading = true
            const { user } = session

            const { data, error, status } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            if (error && status !== 406) throw error

            if (data) {
                username = data.username
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            loading = false
        }
    }

    const updateProfile = async () => {
        try {
            loading = true
            const { user } = session

            const updates = {
                id: user.id,
                username,
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase.from('profiles').upsert(updates)

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message)
            }
        } finally {
            loading = false
        }
    }
</script>

<form on:submit|preventDefault="{updateProfile}" class="items-center flex flex-col">
    <div>Email: {session.user.email}</div>
    <div>
        <label for="username">Name</label>
        <input class="input px-5" id="username" type="text" bind:value="{username}" />
    </div>
    <div class="flex gap-5 mt-5">
        <button type="submit" class="btn variant-ghost-primary" disabled="{loading}">
            {loading ? 'Saving ...' : 'Update profile'}
        </button>
        <button type="button" class="button block" on:click={() => supabase.auth.signOut()}> Sign Out
        </button>

    </div>

</form>