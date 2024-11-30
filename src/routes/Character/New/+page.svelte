<script lang="ts">
    import CharacterSelection from "$lib/components/Character/CharacterSelection.svelte";
    import { classesStore } from "$lib/stores/classes";
    import {supabase} from "$lib/db/client";


   


</script>

<div class="container mx-auto p-8 space-y-8">
    <div class="flex items-center gap-4">
        {#each $classesStore as playableClass}
            <CharacterSelection builtClass={playableClass} />
        {/each}
    </div>
</div>
