// app/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  console.log('Home page rendered')

  return (
    <div className="min-h-screen">
      <div className='flex flex-col items-center justify-center max-w-2xl mx-auto h-[calc(100vh-6rem)]'>
        <div>
          <h1 className='text-5xl font-bold'>PYQs / NOTEs / TRICKs</h1>
          <p className='text-gray-400'>made available for students</p>
        </div>
        <div className='mt-10 text-center'>
          <p className='mb-3'>Access PCCoE Question Papers</p>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  )
}