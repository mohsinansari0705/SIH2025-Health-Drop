import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://hzicxykqtlxhaalgqkey.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aWN4eWtxdGx4aGFhbGdxa2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTI5MjAsImV4cCI6MjA3MzkyODkyMH0.BNzScC1Q14v1kQIdXEgINcChp8wu854alEUptgvOC00';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});