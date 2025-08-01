'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addSubject } from '@/app/action'
import { useState, useTransition, useEffect } from 'react'
import { fetchSubjects } from "@/app/fetchers"
import { Subject } from "@/lib/definitions/subject.schema" // Assuming you created this interface in fetchers.ts or types.ts
import { toast } from 'sonner'

interface AddSubjectProps {
    active: boolean;
}

const AddSubject: React.FC<AddSubjectProps> = ({ active }) => {
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [isPending, startTransition] = useTransition()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [loading, setLoading] = useState(true)


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
            starts_with: name.trim().charAt(0).toUpperCase(),
        }

        startTransition(async () => {
            try {
                await addSubject(subjectData)
                setName('') // reset input
                setCode('')
                toast.success('Subject added !');
            } catch (err) {
                console.error('Error adding subject:', err)
            }
        })
    }

    if (!active) return null

    return (
        <div className='flex flex-col gap-4'>

            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Subjects Panel</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Enter subject name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            placeholder="Enter subject code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Adding...' : 'Add Subject'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>All Subjects</CardTitle>
                </CardHeader>
                <CardContent>
                    

                    <div className="">
                        {loading ? (
                            <p className="text-muted-foreground">Loading...</p>
                        ) : subjects.length === 0 ? (
                            <p className="text-muted-foreground">No subjects found.</p>
                        ) : (
                            <ul className="list-inside space-y-1">
                                {subjects.map((subject) => (
                                    <li key={subject.id}>{subject.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

    )
}

export default AddSubject
