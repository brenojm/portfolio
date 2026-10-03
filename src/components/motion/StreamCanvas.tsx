import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

type Line = { base: number; amp: number; freq: number; phase: number; speed: number }
type Pulse = { line: number; x: number; speed: number; length: number }

const LINES = 26
const PULSES = 14

/**
 * Fluxos de dados animados: linhas que ondulam como dutos/streams, com pulsos
 * de luz percorrendo-as. Reage ao ponteiro, pausa fora da tela ou com a aba
 * oculta e desenha um único quadro estático com prefers-reduced-motion.
 */
export function StreamCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let time = 0
    let last = performance.now()
    const pointer = { x: 0.5, y: 0.5, active: false }

    let colors = readColors()
    const themeObserver = new MutationObserver(() => {
      colors = readColors()
      if (reduced) draw()
    })
    themeObserver.observe(document.documentElement, { attributeFilter: ['class'] })

    const lines: Line[] = Array.from({ length: LINES }, (_, i) => ({
      base: (i + 0.5) / LINES,
      amp: 0.02 + Math.random() * 0.05,
      freq: 1.2 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.25,
    }))
    const pulses: Pulse[] = Array.from({ length: PULSES }, () => newPulse(true))

    function newPulse(randomX = false): Pulse {
      return {
        line: Math.floor(Math.random() * LINES),
        x: randomX ? Math.random() : -0.2,
        speed: 0.08 + Math.random() * 0.14,
        length: 0.06 + Math.random() * 0.1,
      }
    }

    // y (0..1) da linha em uma posição x (0..1)
    function lineY(line: Line, x: number) {
      // As linhas convergem levemente para a direita, como um feixe.
      const converge = 0.5 + (line.base - 0.5) * (1 - x * 0.35)
      let y =
        converge + Math.sin(x * line.freq * Math.PI + line.phase + time * line.speed) * line.amp
      if (pointer.active) {
        const dx = x - pointer.x
        const influence = Math.exp(-(dx * dx) / 0.02)
        y += (pointer.y - y) * influence * 0.12
      }
      return y
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas!.clientWidth
      height = canvas!.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) draw()
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height)
      const step = Math.max(6, width / 160)

      lines.forEach((line, i) => {
        // Linhas do centro ficam mais fortes, criando profundidade.
        const centerWeight = 1 - Math.abs(line.base - 0.5) * 1.6
        ctx!.strokeStyle = i % 3 === 0 ? colors.accent2 : colors.accent
        ctx!.globalAlpha = 0.1 + centerWeight * 0.22
        ctx!.lineWidth = 1
        ctx!.beginPath()
        for (let px = 0; px <= width + step; px += step) {
          const y = lineY(line, px / width) * height
          if (px === 0) ctx!.moveTo(px, y)
          else ctx!.lineTo(px, y)
        }
        ctx!.stroke()
      })

      ctx!.globalAlpha = 1
      pulses.forEach((pulse) => {
        const line = lines[pulse.line]!
        const x0 = pulse.x * width
        const x1 = (pulse.x - pulse.length) * width
        const gradient = ctx!.createLinearGradient(x1, 0, x0, 0)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(1, colors.glow)
        ctx!.strokeStyle = gradient
        ctx!.lineWidth = 2
        ctx!.shadowColor = colors.glow
        ctx!.shadowBlur = 12
        ctx!.beginPath()
        for (let px = x1; px <= x0; px += 4) {
          const y = lineY(line, px / width) * height
          if (px === x1) ctx!.moveTo(px, y)
          else ctx!.lineTo(px, y)
        }
        ctx!.stroke()
        ctx!.shadowBlur = 0
      })
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      time += dt
      pulses.forEach((p, i) => {
        p.x += p.speed * dt
        if (p.x - p.length > 1) pulses[i] = newPulse()
      })
      draw()
      frame = requestAnimationFrame(tick)
    }

    function start() {
      if (reduced || frame || !visible || document.hidden) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersection = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) start()
      else stop()
    })
    intersection.observe(canvas)

    const onVisibility = () => (document.hidden ? stop() : start())
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = (e.clientX - rect.left) / rect.width
      pointer.y = (e.clientY - rect.top) / rect.height
      pointer.active = pointer.y >= 0 && pointer.y <= 1
    }
    const onLeave = () => (pointer.active = false)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    resize()
    start()

    return () => {
      stop()
      resizeObserver.disconnect()
      intersection.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('size-full', className)} />
}

function readColors() {
  const style = getComputedStyle(document.documentElement)
  const accent = style.getPropertyValue('--accent').trim()
  const accent2 = style.getPropertyValue('--accent-2').trim()
  return { accent, accent2, glow: accent2 }
}
