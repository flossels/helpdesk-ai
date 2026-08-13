export function sanitizeFilename(fileName: string): string {
  return fileName
    .replace(/[/\\]/g, '')
    .replace(/\.\./g, '')
    .replace(/\0/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 100)
}
