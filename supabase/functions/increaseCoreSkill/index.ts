
import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {corsHeaders} from "../_shared/cors.ts";
import {getBonus} from "../_shared/helpers.ts";



interface RequestBody {
  skills: Skill[];
  characterId: string;
  sessionId: string;
}

interface Skill {
  skillId: number;
  points: number;
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

    const { skills, characterId, sessionId } = (await req.json()) as RequestBody;
    if (!skills || !characterId || !sessionId) {
      return new Response(JSON.stringify({ error: "Missing parameter" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: currentPool, error: poolError } = await supabaseClient
        .from("coreskill_pools")
        .select("amount")
        .eq("character_id", characterId)
        .eq("session_id", sessionId)
        .single();

    if (poolError || !currentPool) {
      return new Response(JSON.stringify({ error: "Core skill pool not found" }), {
        status: 404,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalPoints = skills.reduce((sum, skill) => sum + skill.points, 0);



    if (currentPool.amount <= 0 || currentPool.amount < totalPoints) {
      return new Response(JSON.stringify({ error: "Out of points" }), {
        status: 404,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: response, error: insertError } = await supabaseClient
        .from("coreskill_pools")
        .update({ amount: currentPool.amount - totalPoints })
        .eq("character_id", characterId)
        .eq("session_id", sessionId)
        .select()
        .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }


    for (const skill of skills) {
      const {data: currentSkillPoints, error: fetchError} = await supabaseClient
          .from("skill_points")
          .select("*")
          .eq("SkillId", skill.skillId)
          .eq("session_id", sessionId)
          .eq("character_id", characterId)
          .single();

      if (fetchError || !currentSkillPoints) {
        return new Response(JSON.stringify({error: `Skill ${skill.skillId} not found`}), {
          status: 404,
          headers: {...corsHeaders, "Content-Type": "application/json"},
        });
      }

      const {data: skillPoints, error: skillPointsError} = await supabaseClient
          .from("skill_points")
          .update({
            Points: currentSkillPoints.Points + skill.points,
            bonus: getBonus(currentSkillPoints.Points + skill.points),
          })
          .eq("SkillId", skill.skillId)
          .eq("session_id", sessionId)
          .eq("character_id", characterId)
          .select()
          .single();

      if (skillPointsError) {
        return new Response(JSON.stringify({error: "Error updating skill points"}), {
          status: 400,
          headers: {...corsHeaders, "Content-Type": "application/json"},
        });
      }
    }

    return new Response(JSON.stringify({ message: "All skills updated successfully" }), {
      status: 200,
      headers: {...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Internal server error", details: e.message }), {
      status: 500,
      headers: {...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
  


