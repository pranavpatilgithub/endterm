'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { fetchSubjects } from "@/app/fetchers";
import { uploadPyqPdf, listPyqPdfs, deleteSinglePdf } from "@/app/action";
import { Subject } from "@/lib/definitions/subject.schema"
import { toast } from 'sonner';

interface AddPyqPapersProps {
  active: boolean;
}

const AddPyqPapers: React.FC<AddPyqPapersProps> = ({ active }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfList, setPdfList] = useState<string[]>([]);

  const loadSubjects = async () => {
    const data = await fetchSubjects();
    setSubjects(data);
    setFilteredSubjects(data);
  };

  useEffect(() => {
    if (active) {
      loadSubjects();
    }
  }, [active]);

  // Filter subjects when search term changes
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerSearch) ||
        s.code.toLowerCase().includes(lowerSearch)
    );
    setFilteredSubjects(filtered);
  }, [searchTerm, subjects]);

  // Fetch PDFs when subject changes
  useEffect(() => {
    const fetchPdfs = async () => {
      if (!selectedCode) return;
      try {
        const pdfs = await listPyqPdfs(selectedCode);
        console.log(`Fetched PDFs for ${selectedCode}:`, pdfs);
        setPdfList(pdfs);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        toast.error(`Failed to load PDFs: ${errorMessage}`);
      }
    };
    fetchPdfs();
  }, [selectedCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedCode) {
      toast.error('Please select a subject and choose a PDF file.');
      return;
    }

    setLoading(true);
    try {
      await uploadPyqPdf(file, selectedCode);
      toast.success('PDF uploaded and subject updated!');
      setFile(null);
      setSelectedCode('');
      setSearchTerm('');
      await loadSubjects();
      setPdfList([]); // Reset list until next subject is selected
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      toast.error(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!active) return null;

  return (
    <Card className="rounded-lg dark:text-gray-100">
      <CardHeader>
        <CardTitle>Add PYQ Papers</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />

          {/* Subject dropdown */}
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            required
          >
            <option value="">-- Select a subject --</option>
            {filteredSubjects.map((subj) => (
              <option key={subj.id} value={subj.code}>
                {subj.name} ({subj.code}) {subj.has_pyqs ? '📄' : ''}
              </option>
            ))}
          </select>

          {/* File input */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full dark:text-gray-100"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </form>

        {/* List existing PDFs */}
        {pdfList.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">Uploaded PDFs</h3>
            <ul className="space-y-2">
              {pdfList.map((pdf) => (
                <li key={pdf} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{pdf}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      const confirmDelete = confirm(`Delete ${pdf}?`);
                      if (!confirmDelete) return;

                      setLoading(true);
                      try {
                        await deleteSinglePdf(selectedCode, pdf);
                        toast.success(`${pdf} deleted.`);
                        setPdfList((prev) => prev.filter((p) => p !== pdf));
                        await loadSubjects();
                      } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                        toast.error(`Failed to delete: ${errorMessage}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
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