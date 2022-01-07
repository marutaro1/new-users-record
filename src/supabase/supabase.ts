import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cjrydvfwmlititxjrwry.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk5MTcyNSwiZXhwIjoxOTU2NTY3NzI1fQ.Z9Xd662nmP0kSV3xFou5tI74HWIof2fCTf-ZUkmq40U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
