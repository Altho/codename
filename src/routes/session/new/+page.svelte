<script lang="ts">
    import { coreSkillsStore } from "$lib/stores/classes";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import CoreSkills from "$lib/components/skills/CoreSkills.svelte";
    import {getToastStore, initializeStores, Step, Stepper} from "@skeletonlabs/skeleton";
    import SessionForm from "$lib/components/sessions/SessionForm.svelte";
    import {
        addCharacterToSession,
        addSkillsToCharacter,
        createCharacter,
        createSession
    } from "$lib/helpers/SupabaseFunctions";
    import {characterBeingCreated, selectedCharacter} from "$lib/stores/characters";

    import {characters} from "$lib/stores/characters";

    let step = 0;

    import {sessionBeingCreated} from "$lib/stores/session";
    import CharacterCard from "$lib/components/Character/CharacterCard.svelte";
    import NewcharacterForm from "$lib/components/Character/NewcharacterForm.svelte";
    import type {Character} from "$lib/types/TGameplay";
    import {currentSession} from "$lib/stores/GameSession";
    import {BadgeAlert} from "lucide-svelte";
    import {goto} from "$app/navigation";




    let selectedCharacterId: number | null = null;
    
    console.log($characters)
    

    const onNextHandler = async () => {
        step++;
        
        switch (step) {
            case 1:
                console.log($sessionBeingCreated.restricted, "-----")
                const session = await createSession($sessionBeingCreated.name, $sessionBeingCreated.restricted, $sessionBeingCreated.password)
                currentSession.set(session.data);


        }
    }
    
    const onCompleteHandler = () => {
        step++;
        if (!$currentSession || !$selectedCharacter)
        {
            throw new Error()
        }
        console.log($currentSession.id, "SESSION")
        addCharacterToSession($currentSession.id, $selectedCharacter?.id, true)
        addSkillsToCharacter($selectedCharacter?.id, $currentSession.id)
        selectedCharacter.set(null)
        sessionBanner.set({showBanner:true, sessionName:$sessionBeingCreated.name, sessionId:$currentSession.id, characterName:$selectedCharacter.Name, characterId:$selectedCharacter?.id, sessionCharacterId:99, isGm:true, createdAt:new Date()})
        goto('/')
    }


   const handleSelecttion = (character: Character) => {
       selectedCharacterId = character.id
   }
    
    
</script>

{#if ($sessionBanner)}
    <div class="container  mx-auto p-8 space-y-8">
    <aside class="alert variant-ghost">
        <div class="alert-message">
            <h3 class="h3">Existing session</h3>
            <p>You're already enrolled in a session. Leave the current session to create a new one</p>
        </div>
    </aside>
    </div>
    {:else}

<div class=" container mx-auto p-8 space-y-8">
    <Stepper on:step={onNextHandler} on:complete={onCompleteHandler}>
        <Step>
            <svelte:fragment slot="header">New game session</svelte:fragment>
            <div class="container mx-auto p-8 max-w-3xl">
            <SessionForm/>
            </div>
        </Step>
        <Step locked={$selectedCharacter === null}>
            <svelte:fragment slot="header">-- Select a character --</svelte:fragment>
            {#each $characters as character}
                <CharacterCard
                        character={character}
                        isSelected={$selectedCharacter?.id === character.id}
                />
            {/each}
            <h1>Create a character</h1>
            <NewcharacterForm/>
        </Step>
        <!-- ... -->
    </Stepper>
</div>
    {/if}