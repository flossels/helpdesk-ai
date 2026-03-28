import { type ReactNode, useState } from 'react'

type Props = {
  title: string
  children: ReactNode
}

export function TogglePanel({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? '▼' : '▶'} {title}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}