import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://loquoybjhnmfiwrsozvk.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvcXVveWJqaG5tZml3cnNvenZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyOTk0MTYsImV4cCI6MjAxODg3NTQxNn0.rqQe5dGqhtnjZCCzl6WWNXA5MQG6vfVqbARhDbpYVTk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
