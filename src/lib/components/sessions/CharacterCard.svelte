<script lang="ts">
    import {Avatar} from "@skeletonlabs/skeleton";
    import {Crown} from "lucide-svelte";

    export let playerCharacter;

</script>

<div class="card p-4 flex items-center gap-4 transition-duration-200 {playerCharacter.is_gm ? 'variant-ghost-warning' : 'variant-ghost-primary'}">
    <Avatar class="h-12 w-12">
        {playerCharacter.Characters.Name?.[0]?.toUpperCase() ?? '?'}
    </Avatar>

    <div class="flex-grow">
          <span class="text-lg font-medium truncate block">
            {playerCharacter.Characters.Name}
          </span>
    </div>

    {#if playerCharacter.is_gm}
        <Crown class="w-5 h-5" />
    {/if}
</div>