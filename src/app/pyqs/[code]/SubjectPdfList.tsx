"use client";

interface PdfFile {
  name: string;
  url: string;
}

export default function SubjectPdfList({ pdfs }: { pdfs: PdfFile[] }) {
  const viewPdf = (url: string) => {
    window.open(url, "_blank");
  };

  return pdfs.length > 0 ? (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pdfs.map((pdf) => (
        <div
          key={pdf.name}
          className="rounded-lg border border-border bg-muted/20 p-4 flex flex-col justify-between hover:shadow-sm transition"
        >
          <p className="font-medium truncate mb-3">{pdf.name}</p>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => viewPdf(pdf.url)}
              className="text-sm text-blue-500 hover:text-blue-400 transition"
            >
              View
            </button>
            <a
              href={pdf.url}
              download={pdf.name}
              className="text-sm text-green-500 hover:text-green-400 transition"
            >
              Download
            </a>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-muted-foreground">No PDFs available for this subject.</p>
  );
}
