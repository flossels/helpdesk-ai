import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export function applyFieldErrors<T extends FieldValues>(
  fieldErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>
): boolean {
  const entries = Object.entries(fieldErrors ?? {})

  for (const [field, messages] of entries) {
    setError(field as Path<T>, { message: messages[0] })
  }

  return entries.length > 0
}
