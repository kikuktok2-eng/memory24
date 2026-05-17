import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lunikvdffdhealidzkzw.supabase.co';
const supabaseAnonKey = 'sb_publishable_zcJkguoLHUTjnklbMFIyfA_46roxbn4'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);