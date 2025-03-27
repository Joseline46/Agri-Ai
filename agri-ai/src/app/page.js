"use client"
import { useRef } from 'react'

// Components
import Hero from '@/components/hero/hero'
import Features from '@/components/features/features'
import AIInsights from '@/components/aiinsights/aiinsights'
import Action from '@/components/action/action'



export default function Home() {
  const featuresRef = useRef(null)
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Hero onExplore={scrollToFeatures} />
      <Features ref={featuresRef} />
      <AIInsights />
      <Action />
    </>
  );
}
