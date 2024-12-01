<script lang="ts">
    import {getToastStore, initializeStores, SlideToggle} from "@skeletonlabs/skeleton";
    import {characterBeingCreated} from "$lib/stores/characters";
    import {createCharacter} from "$lib/helpers/SupabaseFunctions";

    initializeStores();
    const toastStore = getToastStore();


    const handleClick = () => {
        if (!$characterBeingCreated.name || $characterBeingCreated.name.length < 5) {
            toastStore.trigger({
                message: `Invalid name. Try again.`,
                background: 'variant-ghost-error'
            });
            return;
        }
        createCharacter($characterBeingCreated.name)
        characterBeingCreated.set({name: ""})
    }

</script>

<form class="form">
    <div class="flex gap-10">
        <div>
            <label class="label" for="characterName">Character Name</label>
            <input class="input" bind:value={$characterBeingCreated.name} type="text" name="sessionName" required />
        </div>
        <button on:click={handleClick} class="btn variant-ghost self-end" disabled={$characterBeingCreated.name.length<=4}>Create character</button>
    </div>
</form>