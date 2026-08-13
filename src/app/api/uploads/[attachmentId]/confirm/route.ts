import { errorResponse } from '@/shared/lib/apiResponse'
import { db } from '@/shared/lib/db'
import { objectExists } from '@/shared/lib/s3'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { NextRequest } from 'next/server'

export async function PATCH(_request: NextRequest, { params }: { params: Promise<{ attachmentId: string }> }) {
  const user = await getCurrentUser()
  const { attachmentId } = await params

  const scope = user?.organizationId ? { organizationId: user.organizationId } : { uploadedById: null }

  const attachment = await db.attachment.findFirst({
    where: { id: attachmentId, status: 'PENDING', ...scope },
    select: { id: true, fileKey: true }
  })

  if (!attachment) return errorResponse('Attachment not found.', 404)

  if (!(await objectExists(attachment.fileKey))) {
    return errorResponse('Upload did not complete.', 409)
  }

  await db.attachment.update({ where: { id: attachment.id }, data: { status: 'ACTIVE' } })

  return Response.json({ ok: true })
}
