import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

// CORS preflight handler
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: Request) {
  const { metrics, user_token } = await req.json();

  // Get user info (optional, for validation)
  const { data: user } = await supabase.auth.getUser(user_token);
  if (!user || !user.user) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // Create a Supabase client with the user's token
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${user_token}` } } }
  );

  // --- LIMIT LOGIC STARTS HERE ---
  // Get current row count for this user
  const { count } = await supabaseUser
    .from('post_metrics')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.user.id);

  if ((count ?? 0) + metrics.length > 80) {
    return new Response(
      JSON.stringify({ error: "You have reached your 80 post limit." }),
      {
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json',
        },
      }
    );
  }
  // --- LIMIT LOGIC ENDS HERE ---

  for (const m of metrics) {
    const { error } = await supabaseUser.from('post_metrics').upsert({
      post_url: m.post_url ?? 'unknown',
      likes: parseInt(m.likes) || 0,
      comments: parseInt(m.comments) || 0,
      posted_at: m.posted_at,
      user_id: user.user.id,
      content: m.content ?? ''
    });

    if (error) {
      console.error("❌ Supabase insert error:", error, "for metric:", m);
    } else {
      console.log("✅ Inserted metric:", m);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return new Response('Missing user_id', {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  const { data, error } = await supabase
    .from('post_metrics')
    .select('*')
    .eq('user_id', user_id)
    .order('posted_at', { ascending: false }); 

  if (error) {
    console.error("Supabase error:", error);
    return new Response('Error fetching metrics', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'chrome-extension://ecdpccbaacejiejmpppejhknofmhhhba',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    },
  });
}