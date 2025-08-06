import { createClient } from "@/utils/supabase/client";
import { Subject } from "@/lib/definitions/subject.schema"
// import { type PostgrestError } from "@supabase/supabase-js";

export async function fetchSubjects(): Promise<Subject[]> {
    
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('starts_with_letter', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error.message)
    return []
  }

  return data as Subject[]
}

export async function fetchSubjectByCode(code: string): Promise<Subject | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error fetching subject by code:', error.message);
    return null;
  }

  return data as Subject;
}
