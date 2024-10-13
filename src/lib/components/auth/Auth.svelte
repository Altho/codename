<script lang="ts">
    import { supabase } from '$lib/db/client'

    let loading = false
    let email = ''
    let emailSent = false

    import { getToastStore } from '@skeletonlabs/skeleton';

    const toastStore = getToastStore();

    const handleLogin = async () => {
        try {
            loading = true
            const { error } = await supabase.auth.signInWithOtp({ email })
            if (error) throw error
            toastStore.trigger({message:'Check your email for login link!',
                background: 'variant-ghost-tertiary'
            })
            email = ``
            emailSent = true
        } catch (error) {
            if (error instanceof Error) {
                toastStore.trigger({message: error.toString(),
                                    background: 'variant-ghost-error'});
            }
        } finally {
            loading = false
        }
    }
</script>

{#if !emailSent}
<div class="row flex-center flex mainForm">
    <div class="col-6 form-widget" aria-live="polite">

        <form class="form-widget flex flex-col items-center" on:submit|preventDefault="{handleLogin}">
            <div>
                <label class="label mt-5 hidden" for="email">Email</label>
                <input
                        id="email"
                        class=" input p-2 my-5"
                        type="email"
                        placeholder="Your email"
                        bind:value="{email}"
                />
            </div>
            <div>
                <button class="btn variant-ghost-primary" type="submit" aria-live="polite" disabled="{loading}">
                    <span>{loading ? 'Loading' : 'Send magic link'}</span>
                </button>
            </div>
        </form>
    </div>
</div>
    {:else}
    <div class="card p-4 variant-ghost-primary flex flex-col">An email containing your access link was sent to your email address.
    <button class="btn variant-ghost-tertiary mt-5" on:click={() => emailSent = false}>
        <span>Try again</span>
    </button>
    </div>
    {/if}

