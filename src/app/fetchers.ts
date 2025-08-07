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

export interface PdfFile {
  name: string;
  url: string;
}

export async function fetchPyqPdfsByCode(code: string): Promise<PdfFile[]> {
  
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("pyq")
    .list(code + "/", { limit: 100 });

  if (error) {
    console.error("Error fetching PDFs:", error);
    throw error;
  }

  const pdfs: PdfFile[] = data.map((file) => {
    const { data: urlData } = supabase.storage
      .from("pyq")
      .getPublicUrl(`${code}/${file.name}`);

    return {
      name: file.name,
      url: urlData.publicUrl,
    };
  });

  return pdfs;
}
