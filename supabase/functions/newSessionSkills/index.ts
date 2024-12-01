
import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {corsHeaders} from "../_shared/cors.ts";


interface RequestBody {
  sessionId: string;
  characterId: number;
  isGm?: boolean;
}

interface Skill {
  id: number;
  CreatedAt: string;
  UpdatedAt: string;
  Name: string;
  DcEffect: string;
  NpcUse: number | null;
  Enabled: boolean;
  Category: number | null;
}

interface SkillPoint {
  id: number;
  UpdatedAt: string;
  SkillId: number;
  Points: number;
  character_id: number;
  session_id: string;
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

    const { character_id, session_id } = await req.json()
    if (!character_id || !session_id) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }




    const { data: skills, error: skillsError } = await supabaseClient
        .from('Skills')
        .select('id')
        .returns<Skill[]>()

    if (skillsError) throw skillsError

    const skillPointsToInsert = skills.map(skill => ({
      SkillId: skill.id,
      Points: 0, // default value
      user_id: null,
      character_id,
      session_id
    }))

    const { data: insertedSkillPoints, error: insertError } = await supabaseClient
        .from('skill_points')
        .insert(skillPointsToInsert)
        .select()
        .returns<SkillPoint[]>()

    if (insertError) throw insertError

    const { data: skillsPool, error: skillsPoolError } = await supabaseClient
        .from('coreskill_pools')
        .insert([{
          character_id,
          amount: 10,
          session_id
        }])
        .select()
        .single()

    if (skillsPoolError) throw skillsPoolError

    return new Response(JSON.stringify({ data: insertedSkillPoints }), {
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