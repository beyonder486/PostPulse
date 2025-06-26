// app/api/env-check/route.ts
export async function GET() {
  return Response.json({
    deepseekKey: process.env.DEEPSEEK_API_KEY ? "Loaded" : "Missing",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Loaded" : "Missing"
  });
}