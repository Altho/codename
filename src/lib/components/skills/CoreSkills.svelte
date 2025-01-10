<script lang="ts">
    import type { CoreSkillsCategoriesWithSkills } from "$lib/types/TGameplay";
    import { Avatar } from "@skeletonlabs/skeleton";
    import { classesStore } from "$lib/stores/classes";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import { Plus } from 'lucide-svelte';
    import {availablePoints} from "$lib/stores/pointsPool";
    import {increaseCoreSkill} from "$lib/helpers/SupabaseFunctions";
    import { supabase } from "$lib/db/client";
    import { onMount, onDestroy } from 'svelte';
    import type { RealtimeChannel } from '@supabase/supabase-js';
    import { writable } from 'svelte/store';
    import { skillPointsStore } from '$lib/stores/skillPoints';  // Import your store

    const skillPoints = writable<Record<string, number>>({});
    let subscription: RealtimeChannel;

    $: if ($sessionBanner?.characterId && $sessionBanner?.sessionId) {
        loadSkillPoints();
    }

    async function loadSkillPoints() {
        const { data: points, error } = await supabase
            .from('skill_points')
            .select('SkillId, Points')
            .eq('character_id', $sessionBanner.characterId)
            .eq('session_id', $sessionBanner.sessionId);

        if (error) {
            console.error('Error loading skill points:', error);
            return;
        }

        skillPointsStore.set(points); // Set the array directly
    }

    onMount(() => {
        if ($sessionBanner?.characterId && $sessionBanner?.sessionId) {
            console.log("Setting up subscription for:", {
                characterId: $sessionBanner.characterId,
                sessionId: $sessionBanner.sessionId
            });

            subscription = supabase
                .channel('skill_points_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'skill_points'
                    },
                    (payload) => {
                        console.log("Received change:", payload);
                        if (payload.new.character_id === $sessionBanner.characterId
                            && payload.new.session_id === $sessionBanner.sessionId) {
                            loadSkillPoints();
                        }
                    }
                )
                .subscribe((status) => {
                    console.log("Subscription status:", status);
                });
        }
    });

    onDestroy(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });

    const handleCLick = async (skillId: number) => {
        const sessionId = $sessionBanner?.sessionId;
        const characterId = $sessionBanner?.characterId;
        await increaseCoreSkill(characterId, sessionId, skillId);
    }

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
                    {#if ($availablePoints > 0)}
                        <th  class="px-4 py-3 text-left text-sm font-medium text-gray-300"></th>
                    {/if}
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
                        {#if ($availablePoints > 0)}
                            <td class="px-4 py-3 text-sm text-gray-300">
                                <button
                                        class="flex items-center justify-center bg-green-600 hover:bg-green-700 transition-colors duration-200 rounded p-1.5"
                                        on:click={() => {handleCLick(skill.id)}}
                                >
                                    <Plus class="w-4 h-4 text-white" />
                                </button>
                            </td>
                            {/if}
                        <td class="px-4 py-3 text-sm text-gray-300">
                            {$skillPointsStore.find(p => p.SkillId === skill.id)?.Points ?? 0}
                        </td>
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
