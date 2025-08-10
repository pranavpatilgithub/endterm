'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-6rem)] flex flex-col justify-center px-8 sm:px-16">
      {/* Hero Section */}
      <section className="max-w-4xl">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          Previous Year Question Papers <span className="text-primary">PCCoE</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Search, filter, and access all your previous year question papers in one place.
          Organized by subject, year, and exam type for quick, easy preparation.
        </p>

        <div className="mt-6 flex gap-4 flex-wrap">
          <Link href="/pyqs">
            <Button size="lg" className="px-6">Get Started</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="px-6">Learn More</Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mt-20 grid gap-8 sm:grid-cols-3 max-w-6xl">
        <FeatureCard 
          title="Organized & Searchable" 
          desc="Find any paper by subject code, year, or exam type instantly." 
        />
        <FeatureCard 
          title="Always Updated" 
          desc="We keep adding the latest papers so you're never behind." 
        />
        <FeatureCard 
          title="Free & Accessible" 
          desc="No ads, no paywalls — built for students, by students." 
        />
      </section>
    </main>
  )
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-background/60 hover:bg-background/80 transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  )
}
