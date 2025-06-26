import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  // Get the user's token from the Authorization header
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Get user info from Supabase
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Return user info (customize as needed)
  return new Response(JSON.stringify({
    id: user.user.id,
    email: user.user.email,
    user_metadata: user.user.user_metadata,
  }), { status: 200 });
}