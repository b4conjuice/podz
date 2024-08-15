'use client'

import Link from 'next/link'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'

import { type Podcast } from '@/lib/types'
import { deleteFavorite } from '@/server/queries'

export default function Favorites({ favorites }: { favorites: Podcast[] }) {
  if (!favorites || favorites?.length === 0) {
    return null
  }
  return (
    <div className='w-full space-y-4'>
      <h2>favorites</h2>
      <ul className='divide-y divide-cb-dusty-blue'>
        {favorites.map(favorite => (
          <li key={favorite.trackId} className='flex py-4 first:pt-0'>
            <Link
              href={`/podcasts/${favorite.trackId}`}
              className='grow text-cb-pink hover:text-cb-pink/75'
            >
              {favorite.trackName}
            </Link>
            <form
              action={async () => {
                await deleteFavorite(favorite.trackId)
              }}
            >
              <button type='submit' className='group'>
                <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
                <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
