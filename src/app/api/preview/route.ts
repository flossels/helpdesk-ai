import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug') ?? ''
  const draft = await draftMode()
  draft.enable()
  redirect(`/help/${slug}`)
}
