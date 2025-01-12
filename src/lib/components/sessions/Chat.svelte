<script lang="ts">
    import {onMount, onDestroy} from 'svelte';
    import {supabase} from "$lib/db/client";
    import {sessionBanner} from "$lib/stores/sessionBanner";
    import type {RealtimeChannel} from '@supabase/supabase-js';
    import {Dices, Dice3} from 'lucide-svelte';
    import {castDice, insertChatMessage} from "$lib/helpers/SupabaseFunctions";
    import {RangeSlider} from "@skeletonlabs/skeleton";

    let messagesContainer: HTMLDivElement;
    let shouldAutoScroll = true;
    let value = 6;
    let max = 10;

    function handleScroll() {
        if (!messagesContainer) return;
        const {scrollTop, scrollHeight, clientHeight} = messagesContainer;
        const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
        shouldAutoScroll = isAtBottom;
    }

    $: if (messages && messagesContainer && shouldAutoScroll) {
        setTimeout(() => {
            if (messagesContainer instanceof HTMLDivElement) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 0);
    }

    let message = '';
    let isLoading = false;
    let subscription: RealtimeChannel;
    let messages: Array<{
        id: string;
        content: string;
        created_at: string;
        sender: number;
        is_gm: boolean;
        is_log: boolean;
        is_dice?: boolean;
        senderName?: string;
    }> = [];


    async function fetchMessages() {
        if (!$sessionBanner?.sessionId) return;

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        const {data, error} = await supabase
            .from('chat_messages')
            .select(`
                *,
                Characters (
                    id,
                    Name
                )
            `)
            .gt('created_at', fiveMinutesAgo.toISOString())
            .eq('session_id', $sessionBanner.sessionId)
            .order('created_at', {ascending: true});

        if (error) {
            console.error('Error fetching messages:', error);
            return;
        }

        const getSenderName = (name: string | undefined, isLog: boolean) => {
            if (!name) {
                return isLog ? '[System]' : '[AutoDice]';
            } else {
                return `[${name}]`;
            }
        }

        messages = data.map(msg => ({
            ...msg,
            senderName: getSenderName(msg.Characters?.Name, msg.is_log),
            is_gm: msg.is_gm,
            is_log: msg.is_log
        }));
    }

    const handleThrow = async (amount:number) => {
        if (!$sessionBanner ) {
            return
        }
        await castDice($sessionBanner.characterName, $sessionBanner.sessionId, amount);
    }

    const handleClick = async () => {
        if (!$sessionBanner || message.length <= 0) {
            return
        }
        isLoading = true;
        await insertChatMessage($sessionBanner.characterId, message, false, $sessionBanner.isGm, $sessionBanner.sessionId);
        isLoading = false;
        message = '';
        console.log(messages)    }

    onMount(() => {


        if ($sessionBanner?.sessionId) {
            subscription = supabase
                .channel('chat_messages_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'chat_messages',
                        filter: `session_id=eq.${$sessionBanner.sessionId}`
                    },
                    async (payload) => {

                        if (payload.eventType === 'INSERT') {
                            if (payload.new.sender === null) {
                                messages = [...messages, {
                                    ...payload.new,
                                    senderName: payload.new.is_dice ? '[AutoDice]' : '[System]'
                                }];
                                return;
                            }
                            const {data: characterData, error} = await supabase
                                .from('Characters')
                                .select('Name')
                                .eq('id', payload.new.sender)
                                .single();

                            console.log("triggered WS")

                            if (!error && characterData) {
                                messages = [...messages, {
                                    ...payload.new,
                                    senderName: `[${characterData.Name}]`
                                }];
                            }
                        } else {
                            fetchMessages();
                        }
                    }
                )
                .subscribe();
        }
    });

    onDestroy(() => {
        subscription?.unsubscribe();
    });

    $: if ($sessionBanner?.sessionId) {
        fetchMessages();
    }
</script>

<div class="container mx-auto p-8 space-y-8">
    <div class="term">
        <div class="h-full flex flex-col justify-end">
            {#if messages.length > 0}
                <div on:scroll={handleScroll} bind:this={messagesContainer} class="messages-container mb-4">
                    {#each messages as message}
                        <div class="message p-1 rounded">
                            {#if message.is_log}
                                <div class="bg-orange-900/20 p-1 rounded">
                                    <span class="text-purple-500 font-bold">{message.senderName}:</span>
                                    <span class="text-purple-400 italic">{message.message}</span>
                                </div>
                            {:else if message.is_dice}
                                <div class="bg-blue-900/20 p-1 rounded">
                                    <span class="text-blue-500 font-bold">{message.senderName}:</span>
                                    <span class="text-blue-400">{message.message}</span>
                                </div>
                            {:else if message.is_gm}
                                <div class="bg-orange-900/20 p-1 rounded">
                                    <span class="text-orange-500 font-bold">[GM] {message.senderName}:</span>
                                    <span class="text-orange-400">{message.message}</span>
                                </div>
                            {:else}
                                <span class="text-green-500">{message.senderName}:</span>
                                <span class="text-green-300">{message.message}</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="input-wrapper flex gap-4 items-center">
                <div class="p-4 border-2 border-green-500 rounded-lg font-mono max-w-md bg-black/5">
                    <div class="space-y-4 flex gap-8">
                        <RangeSlider
                                name="range-slider"
                                bind:value={value}
                                min={1}
                                max={max}
                                step={1}
                                ticked
                                class="w-48 "
                        >
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-bold text-green-500">[AutoDice]</div>
                            <div class="text-sm text-green-500">{value} / {max}</div>
                        </div>
                        </RangeSlider>

                        <button
                                on:click={() => {handleThrow(value)}}
                                disabled={isLoading}
                                class="h-12 w-12 flex items-center justify-center text-3xl border border-green-500 text-green-500 hover:bg-green-500 hover:bg-opacity-20 transition-colors font-mono focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                            <Dices />
                        </button>
                    </div>
                </div>

                <input
                        type="text"
                        bind:value={message}
                        class="flex-1 h-12 px-6 py-3 border border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:bg-opacity-20 transition-colors font-mono text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                />
                <button
                        on:click={handleClick}
                        disabled={isLoading}
                        class="h-12 px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:bg-opacity-20 transition-colors font-mono text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    {#if isLoading}
                        Loading...
                    {:else}
                        [SEND]
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div>

<style>
    .term {
        position: relative;
        border-radius: 5px;
        border: 2px solid grey;
        background-color: black;
        background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
        height: 35vh;
        margin: 0;
        overflow: hidden;
        padding: 2rem;
        color: white;
        font: 1.3rem Inconsolata, monospace;
        text-shadow: 0 0 5px #c8c8c8;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }



    .term::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.15),
                rgba(0, 0, 0, 0.15) 1px,
                transparent 1px,
                transparent 2px
        );
        pointer-events: none;
    }

    .messages-container {
        overflow-y: auto;
        max-height: calc(35vh - 5rem);
    }

    .message {
        margin-bottom: 0.5rem;
        color: white;
        font-family: Inconsolata, monospace;
    }

    ::selection {
        background: #0080ff;
        text-shadow: none;
    }

    input[type="range"] {
        -webkit-appearance: none;
    }

    input[type="range"]:focus {
        outline: none;
    }










</style>