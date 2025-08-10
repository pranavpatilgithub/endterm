'use client';

import { ModeToggle } from '@/components/ModeToggle';
import { Github } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {

  return (
    <nav className="flex items-center justify-between px-10 py-4 border-b border-border">
      <Link href="/" className="text-xl font-bold tracking-tight">
        ENDTERM
      </Link>

      <div className="flex items-center gap-6">
        
        <Link
          href="https://github.com/pranavpatilgithub/endterm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Github size={20} />
        </Link>

        <ModeToggle />
      </div>
    </nav>
  );
}
