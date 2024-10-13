import { createClient } from '@supabase/supabase-js'



const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY
console.log(supabaseUrl, "url")
export const supabase = createClient(supabaseUrl, supabaseAnonKey)