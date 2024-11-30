<script lang="ts">
    import type { CoreSkillsCategoriesWithSkills } from "$lib/types/TGameplay";
    import { Avatar } from "@skeletonlabs/skeleton";
    import { classesStore } from "$lib/stores/classes";

    const classesAmount = $classesStore.length;

    export let categorie: CoreSkillsCategoriesWithSkills;
</script>

<div class="mx-auto py-4">
    <div
        class="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900/75"
    >
        <div class="px-4 py-3 border-b border-gray-700 bg-gray-800/90">
            <div class="flex items-center gap-3">
                <Avatar
                    initials={categorie.Name.slice(0, 2)}
                    background="bg-surface-500"
                />
                <h2 class="text-xl font-semibold text-gray-200">
                    {categorie.Name}
                </h2>
            </div>
        </div>
        <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-800/75">
                <tr>
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Points</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Skill</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Bonus</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Syn.</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Other</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Total</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >DC Effect</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Synergies</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >Opposes</th
                    >
                    <th
                        class="px-4 py-3 text-left text-sm font-medium text-gray-300"
                        >NPC Use</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700 bg-gray-900/50">
                {#each categorie.Skills as skill}
                    <tr
                        class="hover:bg-gray-800/50 transition-colors duration-150"
                    >
                        <td class="px-4 py-3 text-sm text-gray-300">0</td>
                        <td class="px-4 py-3 text-sm text-gray-300"
                            >{skill.Name}</td
                        >
                        <td class="px-4 py-3 text-sm text-gray-300">0</td>
                        <td class="px-4 py-3 text-sm text-gray-300">1</td>
                        <td class="px-4 py-3 text-sm text-gray-300">0</td>
                        <td class="px-4 py-3 text-sm text-gray-300">0</td>
                        <td class="px-4 py-3 text-sm text-gray-300"
                            >{skill.DcEffect}</td
                        >
                        <td class="px-4 py-3 text-sm text-gray-300">
                            {#if skill.Synergies.length === 0}
                                <span>None</span>
                            {:else if skill.Synergies.length === classesAmount}
                                <span>All</span>
                            {:else}
                                <div class="inline">
                                    {#each skill.Synergies as synergy, i}
                                        <span>
                                            {synergy.Classes.Name}{i <
                                            skill.Synergies.length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    {/each}
                                </div>
                            {/if}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-300">WIP</td>
                        <td class="px-4 py-3 text-sm text-gray-300">
                            {skill.NpcUse ? skill.NpcUse.Name : ""}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
