import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/20/solid'

import { Main, Title } from '@/components/ui'
import Username from './_components/username'
import SignedInFavoritePodcasts from './_components/signedInFavoritesPodcasts'

export default function Home() {
  return (
    <Main className='flex flex-col px-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <SignedIn>
          <SignedInFavoritePodcasts />
        </SignedIn>
      </div>
    </Main>
  )
}
