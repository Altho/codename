<script lang="ts">
    export let character;
    export let isSelected = false;
    import dayjs from 'dayjs/esm';
    import relativeTime from 'dayjs/plugin/relativeTime';
    import { createEventDispatcher } from 'svelte';
    import {selectedCharacter} from "$lib/stores/characters";

    const dispatch = createEventDispatcher();
    dayjs.extend(relativeTime);
</script>

<div
        on:click={() => selectedCharacter.set(character)}
        class="hover:bg-gray-800/50 transition-colors duration-150 card p-4"
        class:selected={isSelected}
>
    <h1>{character.Name}</h1>
    <p>{dayjs(character.Created_at).fromNow()}</p>
</div>

<style>
    .selected {
        border: 2px solid red;
    }
</style>