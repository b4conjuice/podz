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
    <>
      <h2>favorites</h2>
      <ul className='divide-y divide-cb-dusty-blue'>
        {favorites.map(favorite => (
          <li key={favorite.trackId} className='group flex items-center'>
            <Link
              href={`/podcasts/${favorite.trackId}`}
              className='grow py-4 text-cb-pink hover:text-cb-pink/75 group-first:pt-0 group-last:pb-0'
            >
              {favorite.trackName}
            </Link>
            <form
              action={async () => {
                await deleteFavorite(favorite.trackId)
              }}
              className='flex items-center'
            >
              <button type='submit' className='group/button'>
                <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover/button:hidden' />
                <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover/button:block' />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  )
}
