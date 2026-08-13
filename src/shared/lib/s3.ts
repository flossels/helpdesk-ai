import 'server-only'

import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const s3 = new S3Client({ region: process.env.AWS_REGION })
const Bucket = process.env.AWS_S3_BUCKET

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export function generateUploadPost(key: string, contentType: string) {
  if (!Bucket) throw new Error('AWS_S3_BUCKET is not set.')

  return createPresignedPost(s3, {
    Bucket,
    Key: key,
    Conditions: [['content-length-range', 0, MAX_UPLOAD_BYTES]],
    Fields: { 'Content-Type': contentType },
    Expires: 300
  })
}

export async function objectExists(key: string) {
  if (!Bucket) throw new Error('AWS_S3_BUCKET is not set.')

  try {
    await s3.send(new HeadObjectCommand({ Bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

export function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket,
    Key: key,
    ResponseContentDisposition: 'attachment'
  })
  return getSignedUrl(s3, command, { expiresIn: 900 })
}
