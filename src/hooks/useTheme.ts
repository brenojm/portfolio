import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

function readPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

function apply(pref: ThemePreference) {
  const dark = pref === 'dark' || (pref === 'system' && media.matches)
  document.documentElement.classList.toggle('dark', dark)
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

/**
 * Preferência de tema compartilhada entre componentes. O script inline em
 * `index.html` aplica o tema antes da primeira pintura; aqui só mantemos o
 * estado em sincronia e reagimos a mudanças do sistema operacional.
 */
export function useTheme() {
  const preference = useSyncExternalStore(subscribe, readPreference)

  useEffect(() => {
    const onChange = () => apply(readPreference())
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage indisponível (modo privado etc.) — o tema vale só para esta sessão.
    }
    apply(next)
    listeners.forEach((l) => l())
  }, [])

  return { preference, setPreference }
}
