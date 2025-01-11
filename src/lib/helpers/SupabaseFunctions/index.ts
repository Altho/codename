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

export const increaseCoreSkill = async (characterId: number, sessionId: string, skillId: number) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('increaseCoreSkill', {
            body: { skillId, characterId, sessionId },
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

export const insertChatMessage = async (sender: number, message: string, isLog: boolean, isGm: boolean, sessionId: string) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('insertChatMessage', {
            body: { sender, message, isLog, isGm, sessionId },
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


export const addCharacterToSession = async (sessionId: string, characterId: number, isGm: boolean, password: string = '') => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // If password is provided, verify it first
        if (password.length > 0) {
            const { data: sessionCheck, error: passwordError } = await supabase
                .from('game_sessions')
                .select('password')
                .eq('id', sessionId)
                .single();

            if (passwordError) throw passwordError;
            if (sessionCheck.password !== password) {
                throw new Error('Incorrect password');
            }
        }

        const { data, error } = await supabase.functions.invoke('addCharacterToSession', {
            body: { sessionId, characterId, isGm },
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