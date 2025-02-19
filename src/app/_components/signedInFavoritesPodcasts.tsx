import Link from 'next/link'

import Search from './search'
import Favorites from './favorites'
import { getFavorites, getNotes } from '@/server/queries'

export default async function SignedInFavoritePodcasts() {
  const favorites = await getFavorites()
  const notes = await getNotes({ limit: 10 })
  return (
    <>
      <Search favorites={favorites} />
      <Favorites favorites={favorites} />
      <>
        <div className='flex justify-between'>
          <h2>notes</h2>
          <Link href='/notes' className='text-cb-pink hover:text-cb-pink/75'>
            all
          </Link>
        </div>
        {notes.length > 0 ? (
          <ul className='divide-y divide-cb-dusty-blue'>
            {notes.map(note => (
              <li key={note.id} className='group flex items-center space-x-2'>
                <Link
                  href={`/notes/${note.id}`}
                  className='grow py-4 text-cb-pink hover:text-cb-pink/75 group-first:pt-0'
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>you have no notes yet</p>
        )}
      </>
    </>
  )
}
