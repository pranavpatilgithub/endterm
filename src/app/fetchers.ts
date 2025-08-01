import { createClient } from "@/utils/supabase/client";
import { Subject } from "@/lib/definitions/subject.schema"
// import { type PostgrestError } from "@supabase/supabase-js";

export async function fetchSubjects(): Promise<Subject[]> {
    
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('starts_with', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error.message)
    return []
  }

  return data as Subject[]
}