import { draftMode } from 'next/headers'
import { routing } from '@/i18n/routing'
import { redirect } from '@/i18n/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (searchParams.get('secret') !== process.env.PREVIEW_SECRET || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response('Invalid token', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect({ href: `/help/${slug}`, locale: routing.defaultLocale })
}
