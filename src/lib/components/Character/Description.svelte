<div class=" container mx-auto p-8 space-y-8">
    <div class="term">Hello asdfa sf</div>
</div>

<style>
    .term {
        border-radius: 10px;
        border: 2px, solid, grey;
        background-color: black;
        background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
        height: 20vh;
        margin: 0;
        overflow: hidden;
        padding: 2rem;
        color: white;
        font:
            1.3rem Inconsolata,
            monospace;
        text-shadow: 0 0 5px #c8c8c8;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: repeating-linear-gradient(
                0deg,
                rgba(black, 0.15),
                rgba(black, 0.15) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
        }
    }
    ::selection {
        background: #0080ff;
        text-shadow: none;
    }
</style>
