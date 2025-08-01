'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link';
export default function Home() {
  

  

  return (
    <div className="cursor-pointer">
      <div className='flex flex-col items-center justify-center max-w-2xl mx-auto h-[calc(100vh-6rem)]'>
        <div>
          <h1 className='text-5xl font-bold'>PYQs / NOTEs / TRICKs</h1>
          <p className='text-gray-400'>made available for students</p>
        </div>
        <div className='mt-10 text-center'>
          <p className='mb-3'>Access PCCoE Question Papers</p>
          <Link href='/pyqs'><Button className='cursor-pointer'>Get Started</Button></Link>
        </div>
      </div>
    </div>
  )
}