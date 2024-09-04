import { revalidatePath } from 'next/cache'

import Textarea from './textarea'
import { Button } from '@/components/ui'
import { type PodcastEpisode } from '@/lib/types'
import { getNote, saveNote } from '@/server/queries'

export default async function Notes({
  podcastId,
  episode,
}: {
  podcastId: number
  episode: PodcastEpisode
}) {
  const note = await getNote(episode.trackId)
  if (!note) {
    return (
      <form
        className='flex flex-grow flex-col'
        action={async () => {
          'use server'
          const title = episode.trackName
          const body = ''
          const text = `${title}\n\n${body}`
          const newNote = {
            podcastId,
            podcastEpisodeId: episode.trackId,
            text,
            title,
            body,
          }
          await saveNote(newNote)
          revalidatePath(`/podcasts/${podcastId}/episodes/${episode.trackId}`)
        }}
      >
        <div className='flex flex-grow flex-col space-y-4'>
          <Button type='submit'>create note</Button>
        </div>
      </form>
    )
  }

  return (
    <Textarea
      note={{
        id: note.id,
        podcastId,
        podcastEpisodeId: episode.trackId,
        title: episode.trackName,
        body: note.body,
        text: `${episode.trackName}\n\n${note?.body}`,
      }}
    />
  )
}
