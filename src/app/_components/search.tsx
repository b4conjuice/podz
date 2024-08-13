'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useDebounce } from '@uidotdev/usehooks'

import useSearch from '@/lib/useSearch'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'

export default function Search() {
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
      <input
        ref={searchRef}
        type='text'
        className='w-full bg-cb-blue'
        placeholder='enter a term'
        value={search}
        onChange={e => {
          const { value } = e.target
          setSearch(value)
        }}
      />
      {results?.length && results?.length > 0 ? (
        <ul className='divide-y divide-cb-dusty-blue'>
          {results.map(result => (
            <li key={result.trackId} className='py-4 first:pt-0'>
              <Link href={`/podcasts/${result.trackId}`}>
                {result.trackName}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>search for podcasts</p>
      )}
    </div>
  )
}
