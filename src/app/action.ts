// src/lib/actions.ts
'use server'
import { createClient } from "@/utils/supabase/client";
// import { Subject } from "@/lib/definitions/subject.schema"
// import { type PostgrestError } from "@supabase/supabase-js";


export async function addSubject(data: { name: string; code: string, starts_with_letter: string, has_pyqs: boolean, has_notes: boolean }) {
  const supabase = createClient();

  const { error } = await supabase.from('subjects').insert([data])
  if (error) throw new Error(error.message)
}

export async function uploadPyqPdf(file: File, subjectCode: string) {
  const supabase = createClient();

  const filePath = `${subjectCode}/${file.name}`;

  const { data, error } = await supabase.storage
    .from('pyqs')
    .upload(filePath, file, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Optional: mark has_pyqs = true in subject
  const { error: updateError } = await supabase
    .from('subjects')
    .update({ has_pyqs: true, updated_at: new Date().toISOString() })
    .eq('code', subjectCode);

  if (updateError) {
    throw new Error(`File uploaded, but failed to update subject: ${updateError.message}`);
  }

  return data;
}

export async function listPyqPdfs(code: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("pyqs") // replace with your bucket name
    .list(`${code}`, { limit: 100 });

  if (error) throw new Error(error.message);

  return data.filter((item) => item.name.endsWith(".pdf")).map((item) => item.name);
}

export async function deleteSinglePdf(code: string, fileName: string) {
  const supabase = createClient();
  const filePath = `${code}/${fileName}`;
  const { error } = await supabase.storage.from("pyqs").remove([filePath]);

  if (error) throw new Error(error.message);
}