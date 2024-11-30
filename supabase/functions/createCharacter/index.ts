
import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import {corsHeaders} from "../_shared/cors.ts";


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

    const { name } = (await req.json()) as RequestBody;
    if (!name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from("Profiles")
        .select("id")
        .eq("id", user.id)
        .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: character, error: insertError } = await supabaseClient
        .from("Characters")
        .insert([
          {
            "Name": name,
            "ProfileId": profile.id,
          },
        ])
        .select()
        .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: character }), {
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