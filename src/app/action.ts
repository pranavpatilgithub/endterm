// src/lib/actions.ts
'use server'
import { createClient } from "@/utils/supabase/client";
// import { Subject } from "@/lib/definitions/subject.schema"
// import { type PostgrestError } from "@supabase/supabase-js";


export async function addSubject(data: { name: string; code: string, starts_with: string }) {
  const supabase = createClient();

  const { error } = await supabase.from('subjects').insert([data])
  if (error) throw new Error(error.message)
}
