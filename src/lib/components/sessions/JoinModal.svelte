<script lang="ts">
    import {getModalStore, SlideToggle} from "@skeletonlabs/skeleton";
    import {sessionBeingJoined} from "$lib/stores/session";
    import {addCharacterToSession, addSkillsToCharacter, createCharacter} from "$lib/helpers/SupabaseFunctions";
    import {goto} from "$app/navigation";
    import {sessionBanner} from "$lib/stores/sessionBanner";

    const modalStore = getModalStore();

    const handleClick = async () => {
        const character = await createCharacter($sessionBeingJoined.characterName)
        const characterId = character.data.id;
        await addCharacterToSession($sessionBeingJoined.id, characterId, false, $sessionBeingJoined.password)
        await addSkillsToCharacter( characterId, $sessionBeingJoined.id)
        sessionBanner.set({showBanner: true, sessionName: $sessionBeingJoined.sessionName, characterId: characterId, isGm: false, characterName: $sessionBeingJoined.characterName, sessionId: $sessionBeingJoined.id, createdAt: new Date(), sessionCharacterId: 99})
        await goto('/')
        modalStore.close();


    }


</script>

<form class="form">
    <div class="flex items-center gap-10 ">
        <div>
            <label class="label" for="sessionName">Character Name</label>
            <input class="input" bind:value={$sessionBeingJoined.characterName} type="text" name="characterName" required />
        </div>
        {#if ($sessionBeingJoined.locked)}
            <div>
                <label class="label" for="sessionName">Session Password</label>
                <input class="input" bind:value={$sessionBeingJoined.password} type="password" name="sessionPassword" required />
            </div>
        {/if}

        <button on:click={handleClick} class="btn variant-filled-secondary">Join</button>
    </div>

</form>