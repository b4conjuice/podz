'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Title } from '@/components/ui'
import { DEFAULT_TITLE } from '@/lib/defaults'

export default function TopNavTitle({
  title: initialTitle,
}: {
  title?: string
}) {
  const pathname = usePathname()
  const title = initialTitle ?? DEFAULT_TITLE
  return (
    <>
      {pathname === '/' ? (
        <Title>{title}</Title>
      ) : (
        <Link href='/' className='hover:text-cb-pink'>
          <Title>{title}</Title>
        </Link>
      )}
    </>
  )
}
