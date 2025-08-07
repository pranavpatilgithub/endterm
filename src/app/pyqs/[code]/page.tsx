import { fetchSubjectByCode } from "@/app/fetchers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { listPyqPdfs } from "@/app/action"; // ✅ Import correct function
export const dynamic = "force-dynamic";

interface PdfFile {
  name: string;
  url: string;
}

interface Props {
  params: Promise<{ code: string }>;
}

const SubjectPage = async (props: Props) => {
  const params = await props.params;
  const code = await params.code;
  const subject = await fetchSubjectByCode(code);
  if (!subject) return notFound();

  let pdfs: PdfFile[] = [];

  try {
    const fileNames = await listPyqPdfs(code); // ✅ Get PDF names
    pdfs = fileNames.map((name) => ({
      name,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pyqs/${code}/${name}`,
    }));
  } catch (error) {
    console.error("Error loading PDFs:", error);
  }

  return (
    <div className="p-9">
      <Link
        href="/pyqs"
        className="inline-block mb-4 px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-4">{subject.name}</h1>
      <p className="text-gray-600 mb-6">Subject Code: {subject.code}</p>

      {pdfs.length > 0 ? (
        <ul className="space-y-2">
          {pdfs.map((pdf) => (
            <li key={pdf.name}>
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {pdf.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No PDFs available for this subject.</p>
      )}
    </div>
  );
};

export default SubjectPage;
