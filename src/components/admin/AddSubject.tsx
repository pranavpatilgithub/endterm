'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { addSubject } from '@/app/action'
import { useState, useTransition, useEffect } from 'react'
import { fetchSubjects } from "@/app/fetchers"
import { Subject } from "@/lib/definitions/subject.schema"
import { toast } from 'sonner'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { SubjectDropdown } from '@/components/SubjectDropdown'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion' // 👈 Framer Motion

interface AddSubjectProps {
    active: boolean;
}

const AddSubject: React.FC<AddSubjectProps> = ({ active }) => {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [hasPyqs, setHasPyqs] = useState(false)
    const [hasNotes, setHasNotes] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
    const [allSubjects, setAllSubjects] = useState<Subject[]>([])
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const subjectsPerPage = 12;

    // Calculate indices
    const indexOfLastSubject = currentPage * subjectsPerPage;
    const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
    const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject);

    const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

    // Handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };


    // NEW: Track form visibility
    const [formVisible, setFormVisible] = useState(false)

    // Fetch subjects on mount
    const loadSubjects = async () => {
        setLoading(true)
        const data = await fetchSubjects()
        setAllSubjects(data)
        setFilteredSubjects(data)
        setLoading(false)
    }

    useEffect(() => {
        loadSubjects()
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name.trim()) return

        const subjectData = {
            name: name.trim(),
            code: code,
            starts_with_letter: name.trim().charAt(0).toUpperCase(),
            has_pyqs: hasPyqs,
            has_notes: hasNotes,
        }

        startTransition(async () => {
            try {
                await addSubject(subjectData)
                setName('')
                setCode('')
                setHasPyqs(false)
                setHasNotes(false)
                toast.success('Subject added!')
                await loadSubjects()
            } catch (err) {
                console.error('Error adding subject:', err)
                toast.error('Failed to add subject.')
            }
        })
    }

    if (!active) return null

    return (
        <div className='flex flex-col gap-4'>
            {/* 🔍 Search + Toggle Button */}
            {/* 🔍 Search + Toggle Button */}
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <SubjectDropdown
                        value={selectedSubject?.code}
                        onChange={(subject) => {
                            setSelectedSubject(subject)
                            if (subject) {
                                setFilteredSubjects(allSubjects.filter(s => s.id === subject.id))
                            } else {
                                setFilteredSubjects(allSubjects)
                            }
                        }}
                        placeholder="Search subject..."
                    />
                </div>

                {/* Toggle Form Button with Animated Icon */}
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setFormVisible(prev => !prev)}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {formVisible ? (
                            <motion.div
                                key="x-icon"
                                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="plus-icon"
                                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Plus className="h-4 w-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </div>


            {/* ➕ Add Subject Form (Framer Motion Animation) */}
            <AnimatePresence initial={false}>
                {formVisible && (
                    <motion.div
                        key="add-subject-form"
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        transition={{
                            height: { duration: 0.3, ease: 'easeInOut' },
                            opacity: { duration: 0.2, ease: 'easeInOut' },
                            scale: { duration: 0.3, ease: 'easeOut' }
                        }}
                        className="overflow-hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="rounded-lg mt-2 shadow-md">
                                <CardHeader>
                                    <CardTitle>Add Subject</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <input
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter subject name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        <input
                                            className="w-full border p-2 rounded"
                                            placeholder="Enter subject code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="pyqs" checked={hasPyqs} onCheckedChange={(val) => setHasPyqs(!!val)} />
                                            <Label htmlFor="pyqs">Has PYQs</Label>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Checkbox id="notes" checked={hasNotes} onCheckedChange={(val) => setHasNotes(!!val)} />
                                            <Label htmlFor="notes">Has Notes</Label>
                                        </div>

                                        <Button type="submit" disabled={isPending}>
                                            {isPending ? 'Adding...' : 'Add Subject'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* 📚 All Subjects as Cards */}
            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>All Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Loading...</p>
                    ) : filteredSubjects.length === 0 ? (
                        <p className="text-muted-foreground">No subjects found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {currentSubjects.map((subject) => (
                                <Card
                                    key={subject.id}
                                    className="border rounded-lg shadow-sm hover:shadow-md hover:bg-accent/10 transition"
                                >
                                    <CardContent className="pt-4">
                                        <CardTitle className="text-md">{subject.name}</CardTitle>
                                    </CardContent>
                                    <CardContent className="text-xs text-muted-foreground">
                                        Code: {subject.code} <br />
                                        {subject.has_pyqs && 'Has PYQs'}{' '}
                                        {subject.has_notes && 'Has Notes'}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Button
                            variant="outline"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}

            </Card>
        </div>
    )
}

export default AddSubject
