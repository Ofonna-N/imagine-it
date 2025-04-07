import { createClient } from "@supabase/supabase-js";

// Get environment variables
const supabaseUrl =
  process.env.SUPABASE_URL ?? "https://bnrdhpyasurtcrananic.supabase.co";
const supabaseKey = process.env.SUPABASE_SECRET_KEY ?? "";

// Initialize the Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
