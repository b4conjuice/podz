'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

import { Title } from '@/components/ui'
import Username from './username'
import Link from 'next/link'

export default function TopNav() {
  const pathname = usePathname()
  return (
    <div className='mb-4 flex w-full items-center px-4 pt-4'>
      {pathname === '/' ? (
        <Title>podz</Title>
      ) : (
        <Link href='/' className='hover:text-cb-pink'>
          <Title>podz</Title>
        </Link>
      )}
      <div className='flex flex-grow justify-end'>
        <SignedOut>
          <SignInButton>
            <ArrowRightStartOnRectangleIcon className='h-6 w-6 hover:cursor-pointer' />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='flex space-x-2 text-cb-white'>
            <Username />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
