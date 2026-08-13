import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import { getSavedViews } from '@/features/saved-views/queries/getSavedViews'
import { SavedViews } from '@/features/saved-views/components/SavedViews'

export async function SavedViewsList() {
  const user = await getCurrentUser()
  if (!user?.organizationId) return null

  const views = await getSavedViews(user.organizationId)
  return <SavedViews views={views} />
}
