import { headers } from 'next/headers'
import { errorResponse } from '@/shared/lib/apiResponse'
import { db } from '@/shared/lib/db'
import { sanitizeFilename } from '@/shared/lib/sanitizeFilename'
import { rateLimit } from '@/shared/lib/rateLimit'
import { generateUploadPost } from '@/shared/lib/s3'
import { presignSchema } from '@/features/tickets/schemas'
import { getCurrentUser } from '@/features/auth/queries/getCurrentUser'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = presignSchema.safeParse(body)
  if (!parsed.success) return errorResponse('Invalid upload request.', 400)
  const { fileName, fileType, fileSize, entityType, entityId, categoryId } = parsed.data

  const user = await getCurrentUser()
  let organizationId = user?.organizationId ?? null

  if (!organizationId) {
    if (entityType !== 'ticket' || !categoryId) return errorResponse('Not authenticated.', 401)

    const category = await db.category.findUnique({
      where: { id: categoryId },
      select: { organizationId: true }
    })
    if (!category) return errorResponse('Invalid category.', 400)
    organizationId = category.organizationId

    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? headerList.get('x-real-ip') ?? 'unknown'
    const limit = await rateLimit(`presign:${ip}`, { maxRequests: 5, windowMs: 60_000 })
    if (!limit.allowed) return errorResponse('Too many uploads. Please wait a moment.', 429)
  }

  const key = `${organizationId}/${entityType}/` + `${entityId}/${crypto.randomUUID()}-${sanitizeFilename(fileName)}`

  const attachment = await db.attachment.create({
    data: {
      entityType,
      entityId,
      fileName,
      fileKey: key,
      fileType,
      fileSize,
      status: 'PENDING',
      organizationId,
      uploadedById: user?.id ?? null
    },
    select: { id: true }
  })

  const post = await generateUploadPost(key, fileType)
  return Response.json({ ...post, attachmentId: attachment.id })
}
