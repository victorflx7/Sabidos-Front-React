import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nokbbhkcwiwjvlxdsbyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5va2JiaGtjd2l3anZseGRzYnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDM3MjgsImV4cCI6MjA2NDcxOTcyOH0.ieT7VvzWrgyFrZ4VUgzJ1XDfRhQvo88w7_IuflvFQT8'
export const supabase = createClient(supabaseUrl, supabaseKey)
