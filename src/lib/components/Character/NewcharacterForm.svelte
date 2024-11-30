<script lang="ts">
    import {SlideToggle} from "@skeletonlabs/skeleton";
    import {characterBeingCreated} from "$lib/stores/characters";
</script>

<form class="form">
    <div class="flex items-center gap-10">
        <div>
            <label class="label" for="characterName">Character Name</label>
            <input class="input" bind:value={$characterBeingCreated.name} type="text" name="sessionName" required />
        </div>
    </div>

</form>