import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const testUsers = [
      {
        email: "admin@powerzone.com",
        password: "admin123",
        username: "admin",
        fullName: "Gym Admin",
        isAdmin: true,
      },
      {
        email: "member@powerzone.com", 
        password: "member123",
        username: "johndoe",
        fullName: "John Doe",
        isAdmin: false,
      },
    ];

    const results = [];

    for (const testUser of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const exists = existingUsers?.users?.some(u => u.email === testUser.email);

      if (exists) {
        results.push({ email: testUser.email, status: "already exists" });
        continue;
      }

      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          username: testUser.username,
          full_name: testUser.fullName,
        },
      });

      if (createError) {
        console.error("Error creating user:", createError);
        results.push({ email: testUser.email, status: "error", error: createError.message });
        continue;
      }

      // Add admin role if needed
      if (testUser.isAdmin && newUser.user) {
        await supabaseAdmin.from("user_roles").insert({
          user_id: newUser.user.id,
          role: "admin",
        });
      }

      results.push({ email: testUser.email, status: "created" });
    }

    console.log("Seed results:", results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        credentials: [
          { role: "Admin", email: "admin@powerzone.com", password: "admin123" },
          { role: "Member", email: "member@powerzone.com", password: "member123" },
        ]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
