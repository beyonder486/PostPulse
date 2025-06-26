import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true
  }
});

// // GitHub Login (existing)
// export async function signInWithGithub() {
//   return await supabase.auth.signInWithOAuth({
//     provider: 'github',
//     options: { redirectTo: `${location.origin}/dashboard` }
//   });
// }

// NEW: Google Login
export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${location.origin}/dashboard` }
  });
}