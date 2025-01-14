type EventCallback = (data?: any) => void;

interface EventBus {
    on(event: string, callback: EventCallback): void;
    emit(event: string, data?: any): void;
}

interface EventListeners {
    [key: string]: EventCallback[];
}

function createEventBus(): EventBus {
    const eventListeners: EventListeners = {};

    return {
        on(event: string, callback: EventCallback): void {
            if (!eventListeners[event]) {
                eventListeners[event] = [];
            }
            eventListeners[event].push(callback);
        },

        emit(event: string, data?: any): void {
            if (eventListeners[event]) {
                eventListeners[event].forEach(callback => callback(data));
            }
        }
    };
}

export const eventBus = createEventBus();