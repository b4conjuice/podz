'use client'

import useSearch from '@/lib/useSearch'

export default function Search() {
  const list = [
    { id: '1', title: 'title 1', body: 'body 1' },
    { id: '2', title: 'title 2', body: 'body 2' },
  ]
  const { search, setSearch, results, searchRef } = useSearch({
    initialSearch: '',
    list,
    options: {
      keys: ['title', 'body'],
    },
  })
  return (
    <div className='w-full space-y-4'>
      <input
        ref={searchRef}
        type='text'
        className='w-full bg-cb-blue'
        placeholder='search'
        value={search}
        onChange={e => {
          const { value } = e.target
          setSearch(value)
        }}
      />
      {results?.length && results?.length > 0 ? (
        <ul className='divide-y divide-cb-dusty-blue'>
          {results.map(result => (
            <li key={result.id} className='py-4 first:pt-0'>
              <p>{result.title}</p>
              <p>{result.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>no results</p>
      )}
    </div>
  )
}
