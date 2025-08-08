'use client';

import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Subject } from '@/lib/definitions/subject.schema';
import { fetchSubjects } from '@/app/fetchers';

interface SubjectDropdownProps {
    value?: string;
    onChange: (subject: Subject |null) => void;
    placeholder?: string;
}

export function SubjectDropdown({
    value,
    onChange,
    placeholder = 'Select subject...',
}: SubjectDropdownProps) {
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    useEffect(() => {
        const loadSubjects = async () => {
            const data = await fetchSubjects();
            setSubjects(data);
            if (value) {
                const sub = data.find((s) => s.code === value);
                if (sub) setSelectedSubject(sub);
            }
        };
        loadSubjects();
    }, [value]);

    const handleSelect = (subject: Subject) => {
        setSelectedSubject(subject);
        onChange(subject);
        setOpen(false);
    };

    const handleClear = () => {
        setSelectedSubject(null);
        onChange(null);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedSubject
                        ? `${selectedSubject.name} (${selectedSubject.code})`
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <div className="relative">
                        <CommandInput placeholder="Search subject..." />
                        {selectedSubject && (
                            <button
                                onClick={handleClear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 border border-red-400 bg-red-300 text-black dark:bg-red-900 dark:text-white text-xs px-1 py-1 rounded hover:bg-red-800 transition-colors duration-200"
                            >
                                Clear
                            </button>

                        )}
                    </div>

                    <CommandList>
                        <CommandEmpty>No subject found.</CommandEmpty>
                        <CommandGroup>
                            {subjects.map((subj) => (
                                <CommandItem
                                    key={subj.id}
                                    value={subj.code}
                                    onSelect={() => handleSelect(subj)}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === subj.code ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                    {subj.name} ({subj.code}) {subj.has_pyqs ? '📄' : ''}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

