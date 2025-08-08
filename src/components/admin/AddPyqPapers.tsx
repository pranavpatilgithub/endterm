'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { uploadPyqPdf, listPyqPdfs, deleteSinglePdf } from "@/app/action";
import { toast } from 'sonner';
import { SubjectDropdown } from "@/components/SubjectDropdown";
import { Subject } from "@/lib/definitions/subject.schema";

interface AddPyqPapersProps {
  active: boolean;
}

const AddPyqPapers: React.FC<AddPyqPapersProps> = ({ active }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfList, setPdfList] = useState<string[]>([]);

  // Fetch PDFs when subject changes
  useEffect(() => {
    const fetchPdfs = async () => {
      if (!selectedSubject?.code) return;
      try {
        const pdfs = await listPyqPdfs(selectedSubject.code);
        setPdfList(pdfs);
      } catch {
        toast.error(`Failed to load PDFs`);
      }
    };
    fetchPdfs();
  }, [selectedSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedSubject?.code) {
      toast.error('Please select a subject and choose a PDF file.');
      return;
    }

    setLoading(true);
    try {
      await uploadPyqPdf(file, selectedSubject.code);
      toast.success('PDF uploaded!');
      setFile(null);
      setPdfList(await listPyqPdfs(selectedSubject.code)); // refresh list
    } catch {
      toast.error(`Upload failed`);
    } finally {
      setLoading(false);
    }
  };

  if (!active) return null;

  return (
    <Card className="rounded-lg dark:text-gray-100 w-1/2">
      <CardHeader>
        <CardTitle>Add PYQ Papers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Dropdown */}
          <SubjectDropdown
            value={selectedSubject?.id}
            onChange={(subject) => setSelectedSubject(subject)}
            placeholder="Select subject..."
          />

          {/* File input */}
          <label className="flex w-full cursor-pointer flex-col items-center rounded-lg border border-dashed border-gray-400 bg-gray-50 px-4 py-6 text-center text-gray-600 transition hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mb-2 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
            <span className="mb-2 text-sm">Click to select a PDF</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Only .pdf files are allowed
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="hidden"
            />
          </label>

          {file && (
            <div className="mt-2 flex items-center justify-between rounded border border-gray-300 bg-gray-100 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700">
              <span className="truncate max-w-[85%]">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-2 rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-red-600 dark:text-red-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 text-sm"
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>

        
        {pdfList.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Uploaded PDFs</h3>
            <ul className="space-y-2">
              {pdfList.map((pdf) => (
                <li key={pdf} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{pdf}</span>
                  <div className="flex gap-2">

                    {/* <a
                      href={`/api/pyq/view?subject=${selectedSubject?.code}&file=${encodeURIComponent(pdf)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      View
                    </a>
                    
                    <a
                      href={`/api/pyq/download?subject=${selectedSubject?.code}&file=${encodeURIComponent(pdf)}`}
                      className="text-green-600 hover:text-green-800 text-xs"
                      download
                    >
                      Download
                    </a> */}
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm(`Delete ${pdf}?`)) return;
                        setLoading(true);
                        try {
                          await deleteSinglePdf(selectedSubject!.code, pdf);
                          toast.success(`${pdf} deleted.`);
                          setPdfList((prev) => prev.filter((p) => p !== pdf));
                        } catch {
                          toast.error(`Failed to delete`);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="px-2 py-1 rounded-sm bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPyqPapers;
