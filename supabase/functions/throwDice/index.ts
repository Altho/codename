
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

    const { sender, sessionId, diceAmount } = (await req.json()) as RequestBody;
    if (!sender || !diceAmount || !sessionId) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: {...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diceArray = [];

    for (let i = 0; i < diceAmount; i++) {
      diceArray.push(Math.floor(Math.random() * 6) + 1);
    }

    const total = diceArray.reduce((acc, current) => acc + current, 0);

    const diceMessage = `${sender} cast ${diceAmount} ${diceAmount <= 1 ? 'die' : 'dice'}. The result was : [${diceArray}] for a total of ${total}`

    const { data: payload, error: insertError } = await supabaseClient
        .from("chat_messages")
        .insert([
          {
            "message": diceMessage,
            "is_log": false,
            "is_dice": true,
            "is_gm": false,
            "session_id": sessionId,
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

    return new Response(JSON.stringify({ data: payload }), {
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