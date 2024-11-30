<script lang="ts">
    import {SlideToggle} from "@skeletonlabs/skeleton";
    import {sessionBeingCreated} from "$lib/stores/session";
</script>

<form class="form">
    <div class="flex items-center gap-10">
    <div>
        <label class="label" for="sessionName">Session Name</label>
        <input class="input" bind:value={$sessionBeingCreated.name} type="text" name="sessionName" required />
    </div>
        <div>
            <p>Private session</p>
                <SlideToggle name="slide" bind:checked={$sessionBeingCreated.restricted} />
                
        </div>
        {#if $sessionBeingCreated.restricted}
            <div>
                <label class="label" for="sessionPassword">Session Password</label>
                <input class="input" bind:value={$sessionBeingCreated.password} type="text" name="sessionName" required />
            </div>
            {/if}
    </div>
  
</form>