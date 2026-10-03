import { Seo } from '@/components/ui/Seo'
import { About } from '@/features/home/About'
import { Contact } from '@/features/home/Contact'
import { Experience } from '@/features/home/Experience'
import { Hero } from '@/features/home/Hero'
import { LatestPublications } from '@/features/home/LatestPublications'
import { Stack } from '@/features/home/Stack'

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <About />
      <Experience />
      <Stack />
      <LatestPublications />
      <Contact />
    </>
  )
}
