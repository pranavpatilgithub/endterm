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
import { Plus } from 'lucide-react'

interface AddSubjectProps {
    active: boolean;
}

const AddSubject: React.FC<AddSubjectProps> = ({ active }) => {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [hasPyqs, setHasPyqs] = useState(false)
    const [hasNotes, setHasNotes] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

    const [allSubjects, setAllSubjects] = useState<Subject[]>([])
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])

    useEffect(() => {
        const getSubjects = async () => {
            setLoading(true)
            const data = await fetchSubjects()
            setAllSubjects(data)
            setFilteredSubjects(data) // show all initially
            setLoading(false)
        }
        getSubjects();
    }, [])

    useEffect(() => {
        const getSubjects = async () => {
            setLoading(true)
            const data = await fetchSubjects()
            setSubjects(data)
            setLoading(false)
        }
        getSubjects();
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
            } catch (err) {
                console.error('Error adding subject:', err)
            }
        })
    }

    if (!active) return null

    return (
        <div className='flex flex-col gap-4'>
            {/* 🔍 Search + Add Button */}
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <SubjectDropdown
                        value={selectedSubject?.code}
                        onChange={(subject) => {
                            setSelectedSubject(subject)
                            if (subject) {
                                setFilteredSubjects(allSubjects.filter(s => s.id === subject.id))
                            } else {
                                setFilteredSubjects(allSubjects) // reset if cleared
                            }
                        }}
                        placeholder="Search subject..."
                    />
                </div>
                <Button size="icon" variant="outline" onClick={() => {
                    // Scroll to form or open modal
                    document.getElementById('add-subject-form')?.scrollIntoView({ behavior: 'smooth' })
                }}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* ➕ Add Subject Form */}
            <Card className="rounded-lg" id="add-subject-form">
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

            {/* 📚 All Subjects as Cards */}
            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>All Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Loading...</p>
                    ) : subjects.length === 0 ? (
                        <p className="text-muted-foreground">No subjects found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredSubjects.map((subject) => (
                                <Card key={subject.id} className="border rounded-lg shadow-sm hover:shadow-md transition">
                                    <CardContent className="">
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
            </Card>
        </div>
    )
}

export default AddSubject
