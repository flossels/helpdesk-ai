import { errorResponse } from '@/shared/lib/apiResponse'
import { db } from '@/shared/lib/db'
import { generateDownloadUrl } from '@/shared/lib/s3'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ attachmentId: string }> }) {
  const user = await getCurrentUser()
  if (!user?.organizationId) return errorResponse('Not authenticated.', 401)

  const { attachmentId } = await params

  const attachment = await db.attachment.findFirst({
    where: { id: attachmentId, organizationId: user.organizationId, status: 'ACTIVE' },
    select: { fileKey: true }
  })
  if (!attachment) return errorResponse('Attachment not found.', 404)

  const url = await generateDownloadUrl(attachment.fileKey)
  return Response.redirect(url)
}
