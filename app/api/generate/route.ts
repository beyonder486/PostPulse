// app/api/generate/route.ts
import { DeepSeek } from '@/lib/hfClient';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge'; // Vercel Edge Function

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  const { prompt, deviceId } = await req.json();

  if (!deviceId) {
    return Response.json({ error: 'No device ID' }, { status: 400 });
  }

  // Check current count
  const { data, error } = await supabase
    .from('demo_limits')
    .select('count')
    .eq('device_id', deviceId)
    .single();

  if (data && data.count >= 3) {
    return Response.json({ error: 'limit' }, { status: 200 });
  }

  try {
    const generatedText = await DeepSeek.generate(prompt);

    // Format for LinkedIn
    const linkedinPost = `
${generatedText.trim()}

#AI #Productivity #Tech
    `.trim();

    // Increment count
    if (data) {
      await supabase
        .from('demo_limits')
        .update({ count: data.count + 1 })
        .eq('device_id', deviceId);
    } else {
      await supabase
        .from('demo_limits')
        .insert({ device_id: deviceId, count: 1 });
    }

    return Response.json({ content: linkedinPost });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}