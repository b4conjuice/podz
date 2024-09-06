'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { Title } from '@/components/ui'

export default function TopNavTitle() {
  const pathname = usePathname()
  return (
    <>
      {pathname === '/' ? (
        <Title>podz</Title>
      ) : (
        <Link href='/' className='hover:text-cb-pink'>
          <Title>podz</Title>
        </Link>
      )}
    </>
  )
}
