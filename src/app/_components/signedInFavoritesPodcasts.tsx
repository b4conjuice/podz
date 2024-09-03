import Link from 'next/link'

import Search from './search'
import Favorites from './favorites'
import { getFavorites, getNotes } from '@/server/queries'

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
