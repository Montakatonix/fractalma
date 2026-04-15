import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Lead = {
  full_name?: string
  email?: string
  phone?: string
  source?: string
  notes?: string
  status?: string
}

export type QuestionnaireSubmission = {
  full_name: string
  email: string
  phone?: string
  current_situation?: string
  repeated_patterns?: string
  what_have_they_tried?: string
  what_do_they_want?: string
  readiness_level?: number
  extra_notes?: string
}
