import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'

import { type Podcast } from '@/lib/types'
import { addFavorite, deleteFavorite, getFavorites } from '@/server/queries'

export default async function ToggleFavoritesButton({
  podcast,
}: {
  podcast: Podcast
}) {
  const favorites = await getFavorites()
  return (
    <>
      {favorites.find(f => f.trackId === podcast.trackId) ? (
        <form
          action={async () => {
            'use server'
            await deleteFavorite(podcast.trackId)
          }}
          className='flex items-center'
        >
          <button type='submit' className='group'>
            <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
            <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
          </button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server'
            await addFavorite(podcast)
          }}
          className='flex items-center'
        >
          <button type='submit' className='group'>
            <OutlineHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
            <SolidHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
          </button>
        </form>
      )}
    </>
  )
}
