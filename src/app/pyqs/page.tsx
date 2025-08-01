'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Search } from 'lucide-react'

export default function PYQsPage() {
    const [selectedLetter, setSelectedLetter] = useState('A')
    const [searchTerm, setSearchTerm] = useState('')

    console.log('PYQs page rendered')

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    // Mock data - will be replaced with actual data later
    const subjects = {
        A: [
            'Algorithms',
            'Applied Mathematics',
            'Advance Instrumentation',
            'Structural Health Monitoring and Audit',
            'Artificial Intelligence',
            'Advanced Driver Assistance Systems',
            'Android App Development with Kotlin',
            'Agile Project Management',
        ],
        B: [
            'Blockchain Technology',
            'Bio-Inspired Systems and Computing ',
            'Business Intelligence',
        ],
        C: [
            'Computer Networks',
            'Computer Graphics',
            'Compiler Design',
            'Cloud Computing',
            'Computer Vision',
        ],
        D: [
            'Data Structures',
            'Database Management Systems',
            'Digital Electronics',
            'Drone Technology',
            'Software Testing & Quality Assurance',
        ],
        E: ['E waste Management'],
        I: ['Industrial Engineering'],
        L: ['Lean Six Sigma'],
        M: [
            'Microprocessor Architecture (Lab)',
            'Machine Learning / Business Intelligence',
            'Major Project',
            'MOOC Course',
        ],
        N: ['Natural Language Processing', 'Network & Application Security'],
        P: [
            'Project Management & Governance',
            'Professional Ethics',
            'Project Based Learning - V',
        ],
        S: ['Sensors and Automation with IoT', 'Software Testing & Quality Assurance Laboratory'],
        V: ['Virtual Reality / Augmented Reality'],
    };



    const filteredSubjects = subjects[selectedLetter as keyof typeof subjects]?.filter(subject =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <div className="min-h-screen bg-academic-gray">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-normal text-academic-dark flex items-center">
                        <BookOpen className="mr-3 h-5 w-5 text-academic-blue" />
                        Previous Year Questions
                    </h1>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by course name or code ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Alphabet Filter */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Filter by Subject</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                                    {alphabet.map(letter => (
                                        <button
                                            key={letter}
                                            onClick={() => setSelectedLetter(letter)}
                                            className={`p-1 text-center rounded-sm transition-colors ${selectedLetter === letter
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                }`}
                                        >
                                            {letter}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                    {/* Subjects List */}
                    <div className="lg:col-span-3">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-academic-dark">
                                Subjects starting with "{selectedLetter}"
                            </h2>
                            <Badge variant="secondary" className="mt-2">
                                {filteredSubjects.length} subjects found
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map((subject, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <div>
                                                    <h3 className="font-medium text-academic-dark">{subject}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Click to view available PYQs
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects found</h3>
                                    <p className="text-gray-500">
                                        {searchTerm
                                            ? `No subjects matching "${searchTerm}" for letter "${selectedLetter}"`
                                            : `No subjects available for letter "${selectedLetter}"`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}