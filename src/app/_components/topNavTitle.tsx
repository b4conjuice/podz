'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Title } from '@/components/ui'
import { DEFAULT_TITLE } from '@/lib/defaults'

export default function TopNavTitle() {
  const pathname = usePathname()
  return (
    <>
      {pathname === '/' ? (
        <Title>{DEFAULT_TITLE}</Title>
      ) : (
        <Link href='/' className='hover:text-cb-pink'>
          <Title>{DEFAULT_TITLE}</Title>
        </Link>
      )}
    </>
  )
}
