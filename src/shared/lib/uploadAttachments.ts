export async function uploadAttachments(
  files: File[],
  entityType: string,
  entityId: string,
  categoryId?: string
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadOne(file, entityType, entityId, categoryId)))
}

async function uploadOne(file: File, entityType: string, entityId: string, categoryId?: string): Promise<string> {
  const presign = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      entityType,
      entityId,
      categoryId
    })
  })
  if (!presign.ok) throw new Error('Could not prepare the upload.')
  const { url, fields, attachmentId } = (await presign.json()) as {
    url: string
    fields: Record<string, string>
    attachmentId: string
  }

  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => form.append(key, value))
  form.append('file', file)

  const upload = await fetch(url, { method: 'POST', body: form })
  if (!upload.ok) throw new Error('The upload did not complete.')

  const confirm = await fetch(`/api/uploads/${attachmentId}/confirm`, { method: 'PATCH' })
  if (!confirm.ok) throw new Error('The upload could not be confirmed.')

  return attachmentId
}
