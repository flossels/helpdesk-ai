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
  idleLabel?: string
  dropLabel?: string
}

export function FileUpload({ onFiles, idleLabel = 'Drag or click', dropLabel = 'Drop files here…' }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED,
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    onDrop: onFiles
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? <p>{dropLabel}</p> : <p>{idleLabel}</p>}
    </div>
  )
}
