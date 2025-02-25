
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


    const { data: gmCharacter, error: errorGmCharacter } = await supabaseClient
        .from('sessions_characters')
        .select('id, Characters!inner(*)')
        .eq('session_id', session_id)
        .eq('is_gm', true)
        .eq('Characters.ProfileId', user.id)

    if (errorGmCharacter) {
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!gmCharacter || gmCharacter.length === 0) {
      return new Response(JSON.stringify({ error: "Denied" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: skillPoints, error } = await supabaseClient
        .from('skill_points')
        .select(`
    Points,
    other,
    bonus,
    Skills!inner(
      Name,
      CoreSkillsCategories!inner(
        id,
        Name
      )
    )
  `)
        .eq('character_id', character_id)
        .eq('session_id', session_id)
        .order('SkillId', { ascending: true });

    if (error) {
      return new Response(JSON.stringify({
        error: "Failed to fetch skills",
        details: error.message,
        hint: error.hint,
        code: error.code
      }), {
        status: 500,
        headers: {...corsHeaders, "Content-Type": "application/json"},
      });
    }

    const categorizedSkills = skillPoints.reduce((acc, skill) => {
      const categoryName = skill.Skills.CoreSkillsCategories.Name;
      const skillName = skill.Skills.Name;

      if (!acc[categoryName]) {
        acc[categoryName] = {};
      }

      acc[categoryName][skillName] = {
        Points: skill.Points,
        Other: skill.other,
        Bonus: skill.bonus
      };

      return acc;
    }, {});

    return new Response(JSON.stringify(categorizedSkills), {
      status: 200,
      headers: {...corsHeaders, "Content-Type": "application/json"},
    });



  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal server error", details: e.message }), {
      status: 500,
      headers: {...corsHeaders, "Content-Type": "application/json" },
    });
  }
});