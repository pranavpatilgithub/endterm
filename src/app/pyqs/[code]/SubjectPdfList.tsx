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
    <ul className="space-y-2">
      {pdfs.map((pdf) => (
        <li key={pdf.name} className="flex gap-4">
          <button
            onClick={() => viewPdf(pdf.url)}
            className="text-blue-600 underline"
          >
            View
          </button>
          <a
            href={pdf.url}
            download={pdf.name}
            className="text-green-600 underline"
          >
            Download
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No PDFs available for this subject.</p>
  );
}
