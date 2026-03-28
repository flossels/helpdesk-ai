import type { ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { type Theme, ThemeContext } from '../context/themeContext'

type Props = {
  children: ReactNode
}

export function ThemeProvider({ children, }: Props) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light')

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}