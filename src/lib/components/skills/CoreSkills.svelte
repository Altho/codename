<script lang="ts">
    import type { CoreSkillsCategoriesWithSkills } from "$lib/types/TGameplay";
    import { Avatar } from "@skeletonlabs/skeleton";
    import { classesStore } from "$lib/stores/classes";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import {coreSkillsLoader} from "$lib/stores/loaders";
    import { Plus, Minus } from 'lucide-svelte';
    import {availablePoints} from "$lib/stores/pointsPool";
    import {increaseCoreSkill} from "$lib/helpers/SupabaseFunctions";
    import { supabase } from "$lib/db/client";
    import { onMount, onDestroy } from 'svelte';
    import type { RealtimeChannel } from '@supabase/supabase-js';
    import { writable } from 'svelte/store';
    import {initialPoints, pointsToValidate, type SkillPoint, skillPointsStore} from '$lib/stores/skillPoints';

    let flashingSkillId: number | null = null;



    const skillPoints = writable<Record<string, number>>({});
    let subscription: RealtimeChannel;
    import {
        fly
    } from 'svelte/transition';
    import {bonus} from "$lib/helpers/SkillFunctions";
    import {eventBus} from "$lib/helpers/eventBus";

    initialPoints.set($skillPointsStore);
    eventBus.on('resetSkills', (data: any) => {
        console.log('Reset triggered at:');
        resetSkills()
    });

    const resetSkills = async (): Promise<void> => {
        pointsToValidate.set([])
        await loadSkillPoints();

    }



    $: if ($sessionBanner?.characterId && $sessionBanner?.sessionId) {
        loadSkillPoints();
    }
    
    let flash = false;

    async function loadSkillPoints() {
        const { data: points, error } = await supabase
            .from('skill_points')
            .select('SkillId, Points, bonus, syn, other')
            .eq('character_id', $sessionBanner.characterId)
            .eq('session_id', $sessionBanner.sessionId);

        if (error) {
            console.error('Error loading skill points:', error);
            return;
        }

        const pointsWithTotal = points.map(point => ({
            ...point,
            get total() {
                return this.Points + this.bonus + this.syn + this.other;
            }
        }));

        skillPointsStore.set(pointsWithTotal);
        $initialPoints = $skillPointsStore


        console.log($skillPointsStore);
    }

    const handleIncrease = (skillId: number): void => {
        availablePoints.set($availablePoints - 1)
        skillPointsStore.update(skills => {
            return skills.map(skill =>
            skill.SkillId === skillId ? { ...skill, Points: skill.Points + 1 } : skill
            )
        })
        const targetSkill = $skillPointsStore.find(s => s.SkillId === skillId)
        if (!targetSkill) {
            return
        }
        const targetPoints = targetSkill.Points
        const initialSkillPoints = $initialPoints.find(s => s.SkillId === skillId)?.Points;



        const value = initialSkillPoints ? targetPoints - initialSkillPoints : targetPoints;
        const validationTarget = $pointsToValidate?.find(v => v.skillId === skillId)
        console.log(validationTarget, "validation")
        if (!validationTarget) {
            pointsToValidate.update(points => [...points, {skillId: targetSkill.SkillId, points: value}]);
        } else {
            validationTarget.points++
        }
        console.log($pointsToValidate);
    }

    const handleDecrease = (skillId: number): void => {
        availablePoints.set($availablePoints + 1)
        skillPointsStore.update(skills => {
            return skills.map(skill =>
                skill.SkillId === skillId ? { ...skill, Points: skill.Points - 1 } : skill
            )
        })
        const targetSkill = $skillPointsStore.find(s => s.SkillId === skillId)
        if (!targetSkill) {
            return
        }
        const targetPoints = targetSkill.Points

        const validationTarget = $pointsToValidate?.find(v => v.skillId === skillId)
        const initialSkillPoints = $initialPoints.find(s => s.SkillId === skillId)?.Points;

        if (!initialSkillPoints || !validationTarget) {
            return
        }

        console.log(validationTarget.points,initialSkillPoints, "validation")
        if (validationTarget.points - 1 < initialSkillPoints) {
            console.log("removing")
            $pointsToValidate = $pointsToValidate.filter(point => point.skillId !== skillId);
        } else {
            validationTarget.points--
        }
        console.log($pointsToValidate);

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

    $: isDisabled = (skillId: number): boolean => {
        const targetSkillPoints = $initialPoints.find(s => s.SkillId === skillId)?.Points;
        const currentPoints = $skillPointsStore.find(s => s.SkillId === skillId)?.Points;
        console.log(currentPoints);

        if (currentPoints - 1 < targetSkillPoints) {
            console.log("true Target skill points:", targetSkillPoints, currentPoints);
            return true;
        }
        console.log("false Target skill points:", targetSkillPoints, currentPoints);

        return false;
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

                        <th  class="px-4 py-3 text-left text-sm font-medium text-gray-300"></th>

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


                            <td class="px-4 py-3 text-sm text-gray-300 ">
                                <div class="btn-group variant-glass-secondary  items-center justify-center h-12 w-32 rounded p-1.5">
                                    <button disabled={isDisabled(skill.id)}  on:click={() => {handleDecrease(skill.id)}} class="hover:bg-green-700 disabled:bg-black transition-colors duration-200"><Minus/></button>
                                    <button disabled={$availablePoints < 1} on:click={() => {handleIncrease(skill.id)}} class="hover:bg-green-700 disabled:bg-black transition-colors duration-200"><Plus/></button>
                                </div>
                            </td>

                        <td class="px-4 py-3 text-sm text-gray-300 {flashingSkillId === skill.id ? 'flash' : ''}">
                            {$skillPointsStore.find(p => p.SkillId === skill.id)?.Points ?? 0}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-300"
                            >{skill.Name}</td
                        >
                        <td class="px-4 py-3 text-sm text-gray-300">{$skillPointsStore.find(p => p.SkillId === skill.id)?.bonus ?? 0}</td>
                        <td class="px-4 py-3 text-sm text-gray-300">{$skillPointsStore.find(p => p.SkillId === skill.id)?.syn ?? 0}</td>
                        <td class="px-4 py-3 text-sm text-gray-300">{$skillPointsStore.find(p => p.SkillId === skill.id)?.other ?? 0}</td>
                        <td class="px-4 py-3 text-sm text-gray-300">{$skillPointsStore.find(p => p.SkillId === skill.id)?.total ?? 0}</td>
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

<style>
    @keyframes highlight {
        0% {
            background-color: transparent;
            transform: scale(1);
        }
        20% {
            background-color: rgba(34, 197, 94, 0.3);
            transform: scale(1.1);
        }
        100% {
            background-color: transparent;
            transform: scale(1);
        }
    }

    @keyframes pulse {
        0% {
            color: rgb(209, 213, 219);
        }
        50% {
            color: rgb(14, 143, 61);
            text-shadow: 0 0 8px rgba(8, 73, 31, 0.5);
            font-size: x-large;
        }
        100% {
            color: rgb(209, 213, 219);
        }
    }

    .flash {
        animation: pulse 0.8s ease-out;
    }
</style>