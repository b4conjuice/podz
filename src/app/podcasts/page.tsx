import { SignedIn } from '@clerk/nextjs'

import { Main } from '@/components/ui'
import SignedInFavoritePodcasts from '../_components/signedInFavoritesPodcasts'
import TopNav from '../_components/topNav'

export default async function PodcastsPage() {
  return (
    <>
      <TopNav />
      <Main className='flex flex-col px-4'>
        <div className='flex w-full flex-grow flex-col space-y-4'>
          <SignedIn>
            <SignedInFavoritePodcasts />
          </SignedIn>
        </div>
      </Main>
    </>
  )
}
