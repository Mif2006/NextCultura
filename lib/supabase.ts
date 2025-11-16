// lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // must not be public

if (!url || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server environment');
}

export const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false }, // server-side sessions typically not persisted
});

export default supabase;
