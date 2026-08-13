'use client'

import { useDropzone } from 'react-dropzone'
import type { Accept } from 'react-dropzone'

const ACCEPTED: Accept = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/pdf': ['.pdf']
}

type Props = {
  onFiles: (files: File[]) => void
}

export function FileUpload({ onFiles }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    onDrop: onFiles
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop files here…</p> : <p>Drag or click</p>}
    </div>
  )
}
