import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xmvdejqjifcsljpiqofp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lIXZfFu6lxW7Lyh1lXWbZg_8O_Inxmv";

export const isConfigured = !!SUPABASE_URL && !!SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
