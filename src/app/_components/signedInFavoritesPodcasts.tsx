import Link from 'next/link'
import { TrashIcon } from '@heroicons/react/24/solid'

import Search from './search'
import Favorites from './favorites'
import { deleteNote, getFavorites, getNotes } from '@/server/queries'

export default async function SignedInFavoritePodcasts() {
  const favorites = await getFavorites()
  const notes = await getNotes()
  return (
    <>
      <Search favorites={favorites} />
      <Favorites favorites={favorites} />
      <>
        <h2>notes</h2>
        {notes.length > 0 ? (
          <ul className='divide-y divide-cb-dusty-blue'>
            {notes.map(note => (
              <li key={note.id} className='flex py-4 first:pt-0 last:pb-0'>
                <Link
                  href={`/podcasts/${note.podcastId}/${note.podcastEpisodeId}`}
                  className='grow text-cb-pink hover:text-cb-pink/75'
                >
                  {note.title}
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await deleteNote(note.id)
                  }}
                >
                  <button type='submit'>
                    <TrashIcon className='h-6 w-6 text-red-600 hover:text-red-600/75' />
                  </button>
                </form>
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
