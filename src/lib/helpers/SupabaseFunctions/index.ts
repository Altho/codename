import {supabase} from "$lib/db/client";
import type {PointValidation} from "$lib/stores/skillPoints";

interface Skill {
    skillId: number;
    points: number;
}

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

export const increaseCoreSkill = async (skills: PointValidation[], characterId: number, sessionId: string ) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('increaseCoreSkill', {
            body: { skills, characterId, sessionId },
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


export const getPlayerSkills = async ( character_id: number, session_id: string ) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('getPlayerSkills', {
            body: { character_id, session_id },
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

export const castDice = async (sender: number, sessionId: string, amount: number) => {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;


        const { data, error } = await supabase.functions.invoke('throwDice', {
            body: { sender, sessionId, diceAmount: amount },
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