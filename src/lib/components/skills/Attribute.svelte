<script lang="ts">
    import type {Skill} from "$lib/types/TGameplay";

    export let skill: Skill

    const handleClick = () => {
        skill.value++
    }
</script>
<div class="container mx-auto p-8 space-y-8">
    <div>
        {skill.name}
        <div>{skill.value} | {skill.bonus()} | {skill.levelBonus()} | {skill.groupBonus()} | {skill.total} | {skill.DcEffect}</div>
    </div>
    <div> <button class="border-2 m-2 p-2" on:click={handleClick}>Add +1 to base value</button> <button class="border-2 m-2 p-2" on:click={() => skill.value = 0}>Reset</button></div>
</div>

