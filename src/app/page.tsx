import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import Username from './_components/username'
import SignedInFavoritePodcasts from './_components/signedInFavoritesPodcasts'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <div className='flex w-full items-center'>
          <Title>podz</Title>
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
        <SignedIn>
          <SignedInFavoritePodcasts />
        </SignedIn>
      </div>
    </Main>
  )
}
