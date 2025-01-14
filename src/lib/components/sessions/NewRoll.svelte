<script lang="ts">
    export let roll: RollResult   



    type RollResult = {
        castGroup: string,
        characterName: string,
        isPrivate: boolean,
        rolls: [{ cast_by: number, result: number }]
    }

    const numberToDiceEmoji = (num: number): string => {
        const diceEmojis = {
            1: "⚀",
            2: "⚁",
            3: "⚂",
            4: "⚃",
            5: "⚄",
            6: "⚅"
        };
        return diceEmojis[num] || num.toString();
    };

    const createDiceEmojiArray = (): string[] => {

        return roll.rolls.map(r => numberToDiceEmoji(r.result));
    };

    const diceString = createDiceEmojiArray();

    const total = roll.rolls.reduce((a, c) => a + c.result, 0)
</script>


<div class={`${roll.isPrivate ? 'bg-orange-600' : 'bg-green-600'} mb-4 w-fit min-w-64 shadow-xl relative rounded-bl-xl rounded-tr-xl`}>
    {#if roll.isPrivate}
        <div class={`${roll.isPrivate ? 'bg-orange-800' : 'bg-green-800'} pl-1 pr-1 shadow-lg absolute top-[-0.5em] left-3/4 -translate-x-1/2 bg-green-400`}>./AutoDice (private)
        </div>
        {:else}
        <div class="pl-1 pr-1 shadow-lg absolute top-[-0.5em] left-3/4 -translate-x-1/2 bg-green-400">./AutoDice</div>

    {/if}
    <div transition:fade class={`p-1 ${roll.isPrivate ? 'bg-orange-800' : 'bg-green-800'} w-fit rounded-br-md`}>{roll.characterName}</div>
    <div  class="flex align-center justify-center">
        <div class="flex p-2 gap-2 text-5xl">
            {#each diceString as die}
                {#if (die === '⚅')}
                    <span class={`${roll.isPrivate ? 'text-orange-200' : 'text-purple-600'}`}>{die}</span>
                {:else}
                    <span class={`${roll.isPrivate ? 'text-red-600' : 'text-green-800'}`}>{die}</span>
                {/if}
            {/each}
            <div class="flex align-center justify-center text-3xl"><div class={`${roll.isPrivate ? 'bg-orange-700' : 'bg-green-700'} p-1 mb-2 rounded-sm`}>{total}</div></div>
        </div>
    </div>
    
</div>