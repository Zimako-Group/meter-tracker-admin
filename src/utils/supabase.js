import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials - SAME as your mobile app
const supabaseUrl = 'https://xyozcbdvovcrrbqizvjx.supabase.co'
const supabaseAnonKey = 'sb_publishable_xTi1vYxsuj7y8yXUpROMXQ_qNOtLZgf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)