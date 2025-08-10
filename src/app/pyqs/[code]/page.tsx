// app/pyqs/[code]/page.tsx
import { fetchSubjectByCode } from "@/app/fetchers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { listPyqPdfsWithSignedUrls } from "@/app/action";
import SubjectPdfList from "@/app/pyqs/[code]/SubjectPdfList";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function SubjectPage(props: PageProps) {
  const params = await props.params;
  const { code } = params;

  const subject = await fetchSubjectByCode(code);
  if (!subject) return notFound();

  const pdfs = await listPyqPdfsWithSignedUrls(code);

  return (
    <main className="p-8">
      {/* Back Link */}
      <Link
        href="/pyqs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        ← Back to Subjects
      </Link>

      {/* Subject Info */}
      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold">{subject.name}</h1>
        <p className="text-muted-foreground mt-1">
          Subject Code: <span className="font-medium">{subject.code}</span>
        </p>
      </header>

      {/* PDF List */}
      <section>
        {pdfs.length > 0 ? (
          <SubjectPdfList pdfs={pdfs} />
        ) : (
          <div className="p-6 rounded-lg border border-border bg-muted/20 text-center text-muted-foreground">
            No PYQs uploaded for this subject yet.
          </div>
        )}
      </section>
    </main>
  );
}
