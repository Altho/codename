import { writable } from 'svelte/store';
import { supabase } from "$lib/db/client";

export const gameSessionStore = writable<any[]>([]);

let subscription: any;

export function initializeGameSessionSubscription(userId: string) {
    if (subscription) {
        console.log("Subscription already exists");
        return;
    }

    console.log("Setting up realtime subscription...");
    subscription = supabase
        .channel('game_sessions_channel')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'game_sessions',
            },
            (payload) => {
                console.log("Change received:", payload);
            }
        )
        .subscribe((status) => {
            console.log('Subscription status:', status);
        });

    return () => {
        console.log("Cleaning up subscription");
        if (subscription) subscription.unsubscribe();
        subscription = null;
    };
}