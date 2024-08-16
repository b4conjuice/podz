'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { HeartIcon as OutlineHeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import { useDebounce } from '@uidotdev/usehooks'

import useSearch from '@/lib/useSearch'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'
import { addFavorite, deleteFavorite } from '@/server/queries'

export default function Search({ favorites }: { favorites: Podcast[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
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
    } else {
      setResults([])
    }
  }, [debouncedSearch])
  useEffect(() => {
    if (query) {
      setSearch(String(query))
    }
  }, [query, setSearch])
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
          const url = `/${value ? `?q=${value}` : ''}`
          router.push(url)
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
                <form
                  action={async () => {
                    await deleteFavorite(result.trackId)
                  }}
                >
                  <button type='submit' className='group'>
                    <SolidHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
                    <OutlineHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
                  </button>
                </form>
              ) : (
                <form
                  action={async () => {
                    await addFavorite(result)
                  }}
                >
                  <button type='submit' className='group'>
                    <OutlineHeartIcon className='h-6 w-6 text-cb-pink group-hover:hidden' />
                    <SolidHeartIcon className='hidden h-6 w-6 text-cb-pink group-hover:block' />
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
