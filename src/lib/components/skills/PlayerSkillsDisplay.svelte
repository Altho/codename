<script lang="ts">
    import type { CharacterSkills } from "$lib/types/TGameplay";
    import { remoteCharacterSkills } from "$lib/stores/skillPoints";
    import { writable } from 'svelte/store';

    const searchTerm = writable('');

    let isLoading = true;

    $: if ($remoteCharacterSkills && Object.keys($remoteCharacterSkills).length > 0) {
        isLoading = false;
    }

    $: filteredSkills = Object.entries($remoteCharacterSkills).reduce((acc, [category, skills]) => {
        const filteredCategorySkills = Object.entries(skills).filter(([skillName, _]) =>
            skillName.toLowerCase().includes($searchTerm.toLowerCase()) ||
            category.toLowerCase().includes($searchTerm.toLowerCase())
        );

        if (filteredCategorySkills.length > 0) {
            acc[category] = Object.fromEntries(filteredCategorySkills);
        }

        return acc;
    }, {} as CharacterSkills);

    export let isOpen: boolean;
    export let onClose: () => void;

    $: if (!isOpen) {
        isLoading = true;
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 font-mono"
         on:click|self={onClose}>
        {#if isLoading}
            <div class="text-green-500 text-xl">
                LOADING SKILL MATRIX...
                <div class="animate-pulse">|||||||||||||||</div>
            </div>
        {:else}
        <div class="w-full h-full max-w-7xl bg-black text-green-500 p-6 overflow-y-auto border-2 border-green-500"
             on:click|stopPropagation>
            <div class="sticky top-0 flex justify-between items-center bg-black py-4 border-b-2 border-green-500">
                <h2 class="text-2xl">SKILL MATRIX v1.0</h2>
                <button class="text-green-500 hover:text-green-400" on:click={onClose}>
                    [X]
                </button>
            </div>

            <div class="my-4">
                <div class="flex items-center border-2 border-green-500 p-2">
                    <span class="mr-2">>></span>
                    <input
                            type="text"
                            placeholder="SEARCH SKILLS..."
                            bind:value={$searchTerm}
                            class="w-full bg-transparent text-green-500 focus:outline-none placeholder-green-700 uppercase"
                    />
                </div>
            </div>

            <div class="space-y-8">
                {#each Object.entries(filteredSkills) as [category, skills]}
                    <div>
                        <h3 class="text-xl mb-4 uppercase">[{category}]</h3>
                        <div class="overflow-x-auto">
                            <table class="w-full border-2 border-green-500">
                                <thead>
                                <tr class="border-b-2 border-green-500">
                                    <th class="text-left px-4 py-2 uppercase">Skill ID</th>
                                    <th class="text-right px-4 py-2 uppercase">Points</th>
                                    <th class="text-right px-4 py-2 uppercase">Other</th>
                                    <th class="text-right px-4 py-2 uppercase">Bonus</th>
                                    <th class="text-right px-4 py-2 uppercase">Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                {#each Object.entries(skills) as [skillName, details]}
                                    <tr class="hover:bg-green-900/20 border-b border-green-500/50">
                                        <td class="px-4 py-2">{skillName}</td>
                                        <td class="text-right px-4 py-2">{details.Points}</td>
                                        <td class="text-right px-4 py-2">{details.Other}</td>
                                        <td class="text-right px-4 py-2">{details.Bonus}</td>
                                        <td class="text-right px-4 py-2 font-bold">
                                            {details.Points + details.Other + details.Bonus}
                                        </td>
                                    </tr>
                                {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                {/each}

                {#if Object.keys(filteredSkills).length === 0}
                    <div class="p-4 text-center border-2 border-green-500">
                        <p>NO MATCHING SKILLS FOUND IN DATABASE</p>
                    </div>
                {/if}
            </div>
        </div>
            {/if}
    </div>
{/if}