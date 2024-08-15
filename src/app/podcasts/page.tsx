import { SignedIn } from '@clerk/nextjs'

import { Main, Title } from '@/components/ui'
import SignedInFavoritePodcasts from '../_components/signedInFavoritesPodcasts'

export default async function PodcastsPage() {
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
