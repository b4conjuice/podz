'use client'

import Link from 'next/link'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'

import useLocalStorage from '@/lib/useLocalStorage'
import { type Podcast } from '@/lib/types'

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<Podcast[]>(
    'podz-favorites',
    []
  )
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
            <button
              type='button'
              onClick={() => {
                setFavorites(
                  favorites.filter(f => f.trackId !== favorite.trackId)
                )
              }}
              className='group'
            >
              <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
              <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
