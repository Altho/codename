<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from "$lib/db/client";
    import { sessionBanner } from "$lib/stores/sessionBanner";
    import type { RealtimeChannel } from '@supabase/supabase-js';
    import {insertChatMessage} from "$lib/helpers/SupabaseFunctions";

    let message = '';
    let isLoading = false;
    let subscription: RealtimeChannel;
    let messages: Array<{
        id: string;
        content: string;
        created_at: string;
        sender: number;
        senderName?: string;
    }> = [];

    async function fetchMessages() {
        if (!$sessionBanner?.sessionId) return;

        const { data, error } = await supabase
            .from('chat_messages')
            .select(`
                *,
                Characters (
                    id,
                    Name
                )
            `)
            .eq('session_id', $sessionBanner.sessionId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return;
        }

        messages = data.map(msg => ({
            ...msg,
            senderName: msg.Characters?.Name,
            is_gm: msg.Characters?.is_gm,
            is_log: msg.is_log
        }));
    }

    const handleClick = async () => {
        if (!$sessionBanner || message.length <= 0){
            return
        }
        isLoading = true;
        await insertChatMessage($sessionBanner.characterId, message, false, $sessionBanner.isGm, $sessionBanner.sessionId);
        isLoading = false;
        message = '';
    }

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
                            const { data: characterData, error } = await supabase
                                .from('Characters')
                                .select('Name')
                                .eq('id', payload.new.sender)
                                .single();

                            console.log("triggered WS")

                            if (!error && characterData) {
                                messages = [...messages, {
                                    ...payload.new,
                                    senderName: characterData.Name
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
                <div class="messages-container mb-4">
                    {#each messages as message}
                        <div class="message">
                            {#if message.is_log}
                                <span class="text-yellow-500 italic">{message.message}</span>
                            {:else if message.is_gm}
                                <span class="text-red-500 font-bold">[GM] {message.senderName}:</span>
                                <span class="text-red-400">{message.message}</span>
                            {:else}
                                <span class="text-green-500">{message.senderName}:</span>
                                <span class="text-green-300">{message.message}</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="input-wrapper flex gap-4 items-center">
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
        border-radius: 10px;
        border: 2px solid grey;
        background-color: black;
        background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
        height: 30vh;
        margin: 0;
        overflow: hidden;
        padding: 2rem;
        color: white;
        font: 1.3rem Inconsolata, monospace;
        text-shadow: 0 0 5px #c8c8c8;
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
        max-height: calc(30vh - 5rem);
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
</style>