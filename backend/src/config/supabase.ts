import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-supabase-project')) {
  console.warn(
    'Warning: Supabase credentials are missing or default placeholders are used. Supabase integration will be disabled.'
  );
}

export const supabase = supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-project')
  ? createClient(supabaseUrl, supabaseKey)
  : null;
