import {supabase} from "$lib/db/client";

export const createSession = async (sessionName: string, restricted: boolean, password?: boolean | null) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('createSession', {
            body: { name: sessionName, restricted, password: password  ? password : null },
            headers: {
                Authorization: `Bearer ${sessionData.session?.access_token}`
            }
        });

        if (error) {
            console.error('Function error:', error);
            throw error;
        }

        console.log('Success:', data);
        return data;
    } catch (err) {
        console.error('Detailed error:', err);
        throw err;
    }
}

export const createCharacter = async (heroName: string) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('createCharacter', {
            body: { name: heroName},
            headers: {
                Authorization: `Bearer ${sessionData.session?.access_token}`
            }
        });

        if (error) {
            console.error('Function error:', error);
            throw error;
        }

        console.log('Success:', data);
        return data;
    } catch (err) {
        console.error('Detailed error:', err);
        throw err;
    }
}


export const addCharacterToSession = async (sessionId: string, characterId: number, isGm: boolean) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('addCharacterToSession', {
            body: { sessionId, characterId, isGm},
            headers: {
                Authorization: `Bearer ${sessionData.session?.access_token}`
            }
        });

        if (error) {
            console.error('Function error:', error);
            throw error;
        }

        console.log('Success:', data);
        return data;
    } catch (err) {
        console.error('Detailed error:', err);
        throw err;
    }
}

export const addSkillsToCharacter = async ( character_id: number, session_id: string) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('newSessionSkills', {
            body: { character_id, session_id},
            headers: {
                Authorization: `Bearer ${sessionData.session?.access_token}`
            }
        });

        if (error) {
            console.error('Function error:', error);
            throw error;
        }

        console.log('Success:', data);
        return data;
    } catch (err) {
        console.error('Detailed error:', err);
        throw err;
    }
}