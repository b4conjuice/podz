import { SignedIn } from '@clerk/nextjs'

import { Main } from '@/components/ui'
import SignedInFavoritePodcasts from './_components/signedInFavoritesPodcasts'

export default function Home() {
  return (
    <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
      <div className='flex w-full flex-grow flex-col space-y-4'>
        <SignedIn>
          <SignedInFavoritePodcasts />
        </SignedIn>
      </div>
    </Main>
  )
}
