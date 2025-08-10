'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { fetchSubjects } from '@/app/fetchers'
import { Subject } from '@/lib/definitions/subject.schema'

export default function PYQsPage() {
  const [subjectsMap, setSubjectsMap] = useState<Record<string, Subject[]>>({})
  const [selectedLetter, setSelectedLetter] = useState('A')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const subjects = await fetchSubjects()
      const grouped: Record<string, Subject[]> = {}

      for (const subject of subjects) {
        const letter = subject.starts_with_letter.toUpperCase()
        if (!grouped[letter]) grouped[letter] = []
        grouped[letter].push(subject)
      }
      setSubjectsMap(grouped)
    }
    fetchData()
  }, [])

  const filteredSubjects =
    subjectsMap[selectedLetter]?.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <main className="p-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Browse Previous Year Papers</h1>

      <div className="flex gap-10">
        {/* Sidebar - Letter Selector Box */}
        <aside className="w-36 shrink-0">
          <div className="bg-background/60 border border-border rounded-xl p-3 grid grid-cols-4 gap-2">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`py-1 rounded-md text-sm font-medium transition
                  ${letter === selectedLetter
                    ? 'bg-primary dark:text-black text-white'
                    : 'bg-muted hover:bg-accent text-foreground'
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          {/* Search Bar */}
          <Input
            placeholder="Search by subject name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 h-12 max-w-lg"
          />

          {/* Subject Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <Link
                  href={`/pyqs/${subject.code}`}
                  key={subject.code}
                  className="p-4 rounded-xl border border-border bg-background/60 hover:shadow-md hover:translate-y-[-2px] transition"
                >
                  <h3 className="font-semibold">{subject.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      {subject.code ?? 'Click to view available PYQs'}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        subject.has_pyqs ? 'text-green-500' : 'text-red-400'
                      }`}
                    >
                      {subject.has_pyqs ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                No subjects found.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
