import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { auth, clerkClient } from '@clerk/nextjs/server'

import TopNavTitle from './topNavTitle'

export default async function TopNav({
  title,
  children,
}: {
  title?: string
  children?: React.ReactNode
}) {
  const { userId }: { userId: string | null } = auth()
  const user = userId ? await clerkClient.users.getUser(userId) : null
  const username = user?.username
  return (
    <div className='container mx-auto mb-4 flex w-full max-w-screen-md items-center space-x-4 px-4 pt-4 md:px-0'>
      {children ? children : <TopNavTitle title={title} />}
      <div className='flex flex-grow justify-end'>
        <SignedOut>
          <SignInButton>
            <ArrowRightStartOnRectangleIcon className='h-6 w-6 hover:cursor-pointer' />
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='flex space-x-2 text-cb-white'>
            {username && <span>{username}</span>}
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  )
}
