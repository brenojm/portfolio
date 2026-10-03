import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type TypewriterProps = {
  phrases: string[]
  className?: string
  typeSpeed?: number
  deleteSpeed?: number
  holdTime?: number
}

/**
 * Escreve e apaga frases em loop. Leitores de tela recebem a lista completa
 * de uma vez (o texto animado é aria-hidden), e com prefers-reduced-motion
 * a primeira frase aparece estática.
 */
export function Typewriter({
  phrases,
  className,
  typeSpeed = 55,
  deleteSpeed = 28,
  holdTime = 1800,
}: TypewriterProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)

  // Reinicia quando a lista muda (troca de idioma).
  const [prevPhrases, setPrevPhrases] = useState(phrases)
  if (prevPhrases !== phrases) {
    setPrevPhrases(phrases)
    setIndex(0)
    setLength(0)
    setDeleting(false)
  }

  const phrase = phrases[index % phrases.length] ?? ''

  useEffect(() => {
    if (reduced) return
    let delay = deleting ? deleteSpeed : typeSpeed + Math.random() * 40
    if (!deleting && length === phrase.length) delay = holdTime
    if (deleting && length === 0) delay = 300

    const id = window.setTimeout(() => {
      if (!deleting && length === phrase.length) setDeleting(true)
      else if (deleting && length === 0) {
        setDeleting(false)
        setIndex((i) => i + 1)
      } else setLength((n) => n + (deleting ? -1 : 1))
    }, delay)
    return () => window.clearTimeout(id)
  }, [reduced, deleting, length, phrase, typeSpeed, deleteSpeed, holdTime])

  return (
    <span className={className}>
      <span className="sr-only">{phrases.join(' · ')}</span>
      <span aria-hidden="true">
        {reduced ? phrases[0] : phrase.slice(0, length)}
        <span
          className={cn(
            'ml-0.5 inline-block w-[0.06em] translate-y-[0.1em] bg-current align-baseline',
            'h-[0.95em] animate-blink',
          )}
        />
      </span>
    </span>
  )
}
