import { fetchSubjectByCode } from "@/app/fetchers";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ code: string }>; // 👈 change type here
}

const SubjectPage = async ({ params }: Props) => {
  const { code } = await params; // ✅ No error if `use` is not imported

  const subject = await fetchSubjectByCode(code);

  if (!subject) return notFound();

  return (
    <div className="p-9">
      <Link
        href="/pyqs"
        className="inline-block mb-4 px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-4">{subject.name}</h1>
      <p className="text-gray-600">Subject Code: {subject.code}</p>
    </div>
  );
};

export default SubjectPage;
