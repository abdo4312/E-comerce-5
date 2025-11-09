import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbaotyeeezzvsqihxpwe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiYW90eWVlZXp6dnNxaWh4cHdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjQ5OTUsImV4cCI6MjA3Nzk0MDk5NX0._s8GbTRZnK-obJw5tHheh2-0_OFqiXp6uNlJxWe8Mcs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)