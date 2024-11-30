<script lang="ts">
    import { coreSkillsStore } from "$lib/stores/classes";
    import CoreSkills from "$lib/components/skills/CoreSkills.svelte";
    import {Step, Stepper} from "@skeletonlabs/skeleton";
    import SessionForm from "$lib/components/sessions/SessionForm.svelte";
    import {createCharacter, createSession} from "$lib/helpers/SupabaseFunctions";
    import {characterBeingCreated} from "$lib/stores/characters";

    import {characters} from "$lib/stores/characters";

    let step = 0;

    import {sessionBeingCreated} from "$lib/stores/session";
    import CharacterCard from "$lib/components/Character/CharacterCard.svelte";
    import NewcharacterForm from "$lib/components/Character/NewcharacterForm.svelte";
    
    console.log($characters)


    
  

    const onNextHandler = () => {
        step++;
        
        switch (step) {
            case 1:
                createSession($sessionBeingCreated.name, $sessionBeingCreated.restricted, $sessionBeingCreated.password)
        }
    }
    
    const onCompleteHandler = () => {
        step++;
        createCharacter($characterBeingCreated.name)
    }
    
    
</script>

<div class=" container mx-auto p-8 space-y-8">
    <Stepper on:step={onNextHandler} on:complete={onCompleteHandler}>
        <Step>
            <svelte:fragment slot="header">New game session</svelte:fragment>
            <div class="container mx-auto p-8 max-w-3xl">
            <SessionForm/>
            </div>
        </Step>
        <Step>
            <svelte:fragment slot="header">-- Select a character --</svelte:fragment>
            {#each $characters as character}
                <CharacterCard character={character}/>
                {/each}
            <h1>Create a character</h1>
            <NewcharacterForm/>
        </Step>
        <!-- ... -->
    </Stepper>
</div>