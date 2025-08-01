'use client'

import React, { useState } from 'react';
import SidebarLink from '@/components/admin/SidebarLink';
import AddSubject from '@/components/admin/AddSubject';
import AddPyqPapers from '@/components/admin/AddPyqPapers';

export default function Admin() {
    const [activeSection, setActiveSection] = useState('add-subject');


    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full mt-5 pl-9 pr-9">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-white dark:bg-neutral-900 shadow-md rounded-lg p-3 pl-4 h-fit border border-gray-200 dark:border-neutral-800">

                <h2 className="text-md font-normal text-gray-800 dark:text-gray-100 mb-4">Admin Console</h2>
                <div className="flex flex-col gap-2">
                    
                    <SidebarLink
                        title="Add Subjects"
                        active={activeSection === 'add-subject'}
                        onClick={() => setActiveSection('add-subject')}
                        aria-current={activeSection === 'add-subject' ? 'page' : undefined}
                    />
                    <SidebarLink
                        title="Add PYQ Papers"
                        active={activeSection === 'add-pyq-papers'}
                        onClick={() => setActiveSection('add-pyq-papers')}
                        aria-current={activeSection === 'add-pyq-papers' ? 'page' : undefined}
                    />

                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <AddSubject active={activeSection === 'add-subject'} />
                <AddPyqPapers active={activeSection === 'add-pyq-papers'} />
            </div>
        </div>

    )
}