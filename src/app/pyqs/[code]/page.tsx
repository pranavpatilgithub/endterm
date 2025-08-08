// app/pyqs/[code]/page.tsx
import { fetchSubjectByCode } from "@/app/fetchers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { listPyqPdfsWithSignedUrls } from "@/app/action";
import SubjectPdfList from "@/app/pyqs/[code]/SubjectPdfList"; // Client component

export const dynamic = "force-dynamic";

export default async function SubjectPage({ params }: { params: { code: string } }) {
  const code = params.code;

  const subject = await fetchSubjectByCode(code);
  if (!subject) return notFound();

  const pdfs = await listPyqPdfsWithSignedUrls(code);

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

      <SubjectPdfList pdfs={pdfs} />
    </div>
  );
}
