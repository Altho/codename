<script lang="ts">
    export let character;
    import dayjs from 'dayjs/esm';  // Changed this line
    import relativeTime from 'dayjs/plugin/relativeTime';

    dayjs.extend(relativeTime);
    
</script>

<div class="card p-4 .card-hover">
    <h1>{character.Name}</h1>
    <p>{dayjs(character.Created_at).fromNow()}</p>
</div>