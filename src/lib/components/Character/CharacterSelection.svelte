<script lang="ts">
    import type { BuiltClass } from "$lib/types/TGameplay";
    export let builtClass: BuiltClass;
    console.log(builtClass);
</script>

<button
    class="relative variant-ghost-primary selector relative overflow-hidden group bg-gradient-to-b from-primary-500/50 to-primary-900/80 mix-blend-multiply backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-200"
    style="{builtClass.Picture
        ? `background-image:url(${builtClass.Picture});`
        : ''} background-size: cover; background-position: center;"
>
    <div
        class="bgg bg-gradient-to-b from-primary-500/50 to-primary-900/80 mix-blend-multiply backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-200"
    ></div>
    <div class="title flex justify-center absolute bottom-0 w-full">
        {builtClass.Name}
    </div>
</button>

<style>
    .selector {
        height: 60vh;
        width: 30vw;
        background-blend-mode: screen;
    }

    .bgg {
        isolation: isolate; /* For mix-blend-multiply to work properly */
        background-image: linear-gradient(
            to bottom,
            rgba(var(--primary-500), 0.2),
            /* 50% opacity */ rgba(var(--primary-900), 0.5) /* 80% opacity */
        );
        mix-blend-mode: multiply;
        backdrop-filter: blur(40px);
    }

    .title {
        background-color: black;
        opacity: 0.8;
    }

    .selector:hover {
        transform: scale(1.15);
    }
</style>
