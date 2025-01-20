<script lang="ts">
    import {Avatar} from "@skeletonlabs/skeleton";
    import {Crown} from "lucide-svelte";
    import {getPlayerSkills} from "$lib/helpers/SupabaseFunctions";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import {remoteCharacterSkills} from "$lib/stores/skillPoints";
    import PlayerSkillsDisplay from "$lib/components/skills/PlayerSkillsDisplay.svelte";

    export let playerCharacter;

    let isSkillMatrixOpen = false;

    async function openSkillMatrix() {
        isSkillMatrixOpen = true;
        const playerSkills = await getPlayerSkills(playerCharacter.character_id, $sessionBanner.sessionId)
        remoteCharacterSkills.set(playerSkills)
    }

    function closeSkillMatrix() {
        isSkillMatrixOpen = false;
        remoteCharacterSkills.set({})
    }



</script>

<div class="card p-4 flex items-center gap-4 transition-duration-200 {playerCharacter.is_gm ? 'variant-ghost-warning' : 'variant-ghost-primary'}">
    <Avatar class="h-12 w-12">
        {playerCharacter.Characters.Name?.[0]?.toUpperCase() ?? '?'}
    </Avatar>

    <div class="flex-grow">
          <span class="text-lg font-medium truncate block">
            {playerCharacter.Characters.Name}
          </span>
        <button on:click={openSkillMatrix}>Get</button>
    </div>

    {#if playerCharacter.is_gm}
        <Crown class="w-5 h-5"/>
    {/if}

        <PlayerSkillsDisplay isOpen={isSkillMatrixOpen}
                             onClose={closeSkillMatrix}/>

</div>