// src/components/Navbar.tsx
'use client';

import { ModeToggle } from '@/components/ModeToggle';
import { Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'; // Import the hook

export function Navbar() {
  const pathname = usePathname(); // Get the current path

  return (
    <nav className='flex items-center justify-between pt-4 pb-4 pl-10 pr-10'>
      <div className='flex items-center'>
        <h2 className='text-xl font-bold'>ENDTERM</h2>
      </div>
      <div className='flex items-center gap-6'>
        <ModeToggle />
        <Link 
          href="/pyqs" 
          className={pathname === '/pyqs' ? 'underline underline-offset-4' : ''}
        >
          PYQs
        </Link>
        <Link 
          href="/notes" 
          className={pathname === '/notes' ? 'underline underline-offset-4' : ''}
        >
          NOTEs
        </Link>
        <Link href="/">
          <Github />
        </Link>
      </div>
    </nav>
  );
}