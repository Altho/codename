<script lang="ts">
    import { coreSkillsStore } from "$lib/stores/classes";
    import CoreSkills from "$lib/components/skills/CoreSkills.svelte";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import { supabase } from "$lib/db/client";
    import Description from "$lib/components/Character/Description.svelte";
    import CoreSkillPoolDisplay from "$lib/components/skills/CoreSkillPoolDisplay.svelte";
</script>

{#if ($sessionBanner)}
    <CoreSkillPoolDisplay />

    <div class=" container mx-auto p-8 space-y-8">
        {#each $coreSkillsStore as category}
            <CoreSkills categorie={category} />
        {/each}
    </div>
    {/if}



