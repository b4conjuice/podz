'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDebounce } from '@uidotdev/usehooks'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'

import useSearch from '@/lib/useSearch'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'
import useLocalStorage from '@/lib/useLocalStorage'

export default function Search() {
  const [favorites, setFavorites] = useLocalStorage<Podcast[]>(
    'podz-favorites',
    []
  )
  const [results, setResults] = useState<Podcast[]>([])
  const { search, setSearch, searchRef } = useSearch({
    initialSearch: '',
    options: {
      keys: ['title', 'body'],
    },
  })
  const debouncedSearch = useDebounce(search, 500)
  useEffect(() => {
    async function fetchData() {
      const newPodcasts = await fetcher<Podcast[]>(
        `/api/podcasts/search?term=${debouncedSearch}`
      )
      setResults(newPodcasts)
    }
    if (debouncedSearch) {
      void fetchData()
    }
  }, [debouncedSearch])
  return (
    <div className='w-full space-y-4'>
      <h2>search</h2>
      <input
        ref={searchRef}
        type='text'
        className='w-full bg-cb-blue'
        placeholder='enter a podcast name'
        value={search}
        onChange={e => {
          const { value } = e.target
          setSearch(value)
        }}
      />
      {results?.length && results?.length > 0 ? (
        <ul className='divide-y divide-cb-dusty-blue'>
          {results.map(result => (
            <li key={result.trackId} className='flex py-4 first:pt-0'>
              <Link
                href={`/podcasts/${result.trackId}`}
                className='grow text-cb-pink hover:text-cb-pink/75'
              >
                {result.trackName}
              </Link>
              {favorites.find(f => f.trackId === result.trackId) ? (
                <button
                  type='button'
                  onClick={() => {
                    setFavorites(
                      favorites.filter(f => f.trackId !== result.trackId)
                    )
                  }}
                  className='group'
                >
                  <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
                  <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => {
                    setFavorites([...favorites, result])
                  }}
                  className='group'
                >
                  <OutlineHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
                  <SolidHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
