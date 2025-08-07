'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { fetchSubjects } from '@/app/fetchers'
import { Subject } from '@/lib/definitions/subject.schema'

const PYQsPage = () => {
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
        subjectsMap[selectedLetter]?.filter((subject) =>
            subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    return (
        <main className="p-9 w-full">
            <h1 className="text-2xl font-medium mb-4">Find Your Papers</h1>

            <div className='flex flex-row w-full gap-6 justify-between'>

                <div className="grid grid-cols-4 gap-3 mb-6 bg-gray-900 p-5 rounded-2xl w-1/5">
                    {letters.map((letter) => (
                        <button
                            key={letter}
                            className={`w-full px-3 py-2 rounded-md text-center transition ${letter === selectedLetter
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-gray-200 hover:bg-gray-200'
                                }`}
                            onClick={() => setSelectedLetter(letter)}
                        >
                            {letter}
                        </button>
                    ))}
                </div>

                <div className='flex items-start flex-col w-4/5'>
                    <Input

                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-6 h-12"
                    />


                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {filteredSubjects.length > 0 ? (
                            filteredSubjects.map((subject) => (
                                <Link
                                    href={`/pyqs/${subject.code}`}
                                    key={subject.code}
                                    className="p-2 rounded border hover:shadow transition"
                                >
                                    <h3 className="font-medium text-academic-dark">{subject.name}</h3>
                                    <div className="flex flex-row justify-between items-center mt-2">
                                        <p className="text-sm text-gray-500">
                                            {subject.code ?? 'Click to view available PYQs'}
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${subject.has_pyqs ? 'text-green-500' : 'text-red-400'
                                                }`}
                                        >
                                            {subject.has_pyqs ? 'PYQs Available' : 'PYQs Not Available'}
                                        </p>
                                    </div>

                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No subjects found.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PYQsPage
