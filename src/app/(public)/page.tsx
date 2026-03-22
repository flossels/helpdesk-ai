import { cacheLife } from 'next/cache'

export default function HomePage() {
  'use cache'
  cacheLife('max')

  return <h1>Welcome to HelpDesk AI</h1>
}
