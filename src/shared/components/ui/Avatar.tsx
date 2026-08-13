import Image from 'next/image'
import { cn } from '@/shared/lib/cn'

type AvatarProps = {
  name: string
  image: string | null
  size?: number
}

export function Avatar({ name, image, size = 32 }: AvatarProps) {
  if (!image) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center rounded-full',
          'bg-slate-200 text-xs font-medium text-slate-600',
          'dark:bg-slate-700 dark:text-slate-300'
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }

  return (
    <Image
      src={image}
      alt={name}
      width={size}
      height={size}
      quality={60}
      sizes={`${size}px`}
      className={cn('shrink-0 rounded-full')}
    />
  )
}
