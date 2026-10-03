declare module 'virtual:content' {
  import type { Profile, Publication } from '@/content/schema'
  export const profile: Profile
  export const publications: Publication[]
}
