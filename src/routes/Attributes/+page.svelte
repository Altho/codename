<script lang="ts">
    import {attributes} from "../../lib/stores/attributes";
    console.log($attributes)
    import Attribute from "../../lib/components/skills/Attribute.svelte";
</script>

<h1>Reactivity test</h1>
<hr/>

{#each $attributes as attribute}
    <h2>{attribute.name}</h2>
    <br>
    {#each attribute.skills as skill}
        <Attribute skill={skill}/>
        {/each}

    {/each}
<div></div>