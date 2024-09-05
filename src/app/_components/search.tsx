'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  MagnifyingGlassIcon,
  HeartIcon as OutlineHeartIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/24/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import { useDebounce } from '@uidotdev/usehooks'
import classNames from 'classnames'

import useSearch from '@/lib/useSearch'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'
import { addFavorite, deleteFavorite } from '@/server/queries'

export default function Search({ favorites }: { favorites: Podcast[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<Podcast[]>([])
  const { search, setSearch } = useSearch({
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
    <>
      <Combobox
        as='div'
        onChange={(podcast: Podcast) => {
          router.push(`/podcasts/${podcast.trackId}`)
        }}
        className='relative mx-auto w-full divide-y divide-cb-dusty-blue overflow-hidden rounded-xl bg-cb-blue ring-1 ring-cb-mint'
      >
        <div className='flex items-center space-x-2 px-4'>
          <MagnifyingGlassIcon className='h-6 w-6 text-cb-yellow' />
          <ComboboxInput
            onChange={e => {
              const { value } = e.target
              setSearch(value)
              const url = `/${value ? `?q=${value}` : ''}`
              router.push(url)
            }}
            className='h-12 w-full border-0 bg-transparent placeholder-cb-yellow/75 focus:outline-0 focus:ring-0'
            placeholder='search apple podcasts'
            value={search}
          />
        </div>
        {results.length > 0 && (
          <ComboboxOptions static className='max-h-40 overflow-y-auto py-4'>
            {results.map(result => {
              return (
                <ComboboxOption key={result.trackId} value={result}>
                  {({ active }) => {
                    return (
                      <div
                        className={classNames(
                          'flex space-x-1 px-4 py-2',
                          active ? 'bg-cb-yellow' : 'bg-cb-blue'
                        )}
                      >
                        <span
                          className={classNames(
                            'grow font-medium',
                            active ? 'text-cb-blue' : ''
                          )}
                        >
                          {result.trackName}
                        </span>
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
                      </div>
                    )
                  }}
                </ComboboxOption>
              )
            })}
          </ComboboxOptions>
        )}
      </Combobox>
    </>
  )
}
