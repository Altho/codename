<script lang="ts">
    import { coreSkillsStore } from "$lib/stores/classes";
    import CoreSkills from "$lib/components/skills/CoreSkills.svelte";
    import Description from "$lib/components/Character/Description.svelte";
</script>

<div class=" container mx-auto p-8 space-y-8">
    {#each $coreSkillsStore as category}
        <CoreSkills categorie={category} />
    {/each}
</div>

<Description />
