
import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {corsHeaders} from "../_shared/cors.ts";


interface RequestBody {
  sessionId: string;
  characterId: number;
  isGm?: boolean;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          realtime: true
        },
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
          JSON.stringify({ error: "No authorization header" }),
          { status: 401, headers: {...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""));

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sessionId, characterId, isGm } = (await req.json()) as RequestBody;
    if (!sessionId || !characterId) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: character, error: characterError } = await supabaseClient
        .from('Characters')
        .select()
        .eq('id', characterId)
        .eq('ProfileId', user.id)
        .single()

    if (characterError || !character) {
      return new Response(JSON.stringify({ error: "Character not found or not owned by user" }), {
        status: 404,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existing } = await supabaseClient
        .from('sessions_characters')
        .select()
        .eq('character_id', characterId)
        .eq('session_id', sessionId)
        .single()

    if (existing) {
      return new Response(JSON.stringify({ error: "Character already in session" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabaseClient
        .from('sessions_characters')
        .insert([{
          character_id: characterId,
          session_id: sessionId,
          is_gm: isGm ?? false
        }])
        .select()
        .single()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: {...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    return new Response(JSON.stringify({ data }), {
      headers: {...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })

  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal server error", details: e.message }), {
      status: 500,
      headers: {...corsHeaders, "Content-Type": "application/json" },
    });
  }
});