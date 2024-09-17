import { revalidatePath } from 'next/cache'

import Textarea from '@/app/_components/textarea'
import { Button } from '@/components/ui'
import { type PodcastEpisode } from '@/lib/types'
import {
  getNote,
  getPodcastEpisodeRelation,
  saveNote,
  savePodcastEpisodeRelation,
} from '@/server/queries'

export default async function Notes({
  podcastId,
  episode,
}: {
  podcastId: number
  episode: PodcastEpisode
}) {
  const podcastEpisode = await getPodcastEpisodeRelation({
    podcastId,
    podcastEpisodeId: episode.trackId,
  })
  if (!podcastEpisode) {
    return (
      <form
        className='flex flex-grow flex-col'
        action={async () => {
          'use server'
          const title = episode.trackName
          const body = ''
          const text = `${title}\n\n${body}`
          const newNote = {
            text,
            title,
            body,
          }
          const noteId = await saveNote(newNote)
          const newPodcastEpisode = {
            podcastId,
            podcastEpisodeId: episode.trackId,
            noteId,
          }
          await savePodcastEpisodeRelation(newPodcastEpisode)
          revalidatePath(`/podcasts/${podcastId}/${episode.trackId}`)
        }}
      >
        <div className='flex flex-grow flex-col space-y-4'>
          <Button type='submit'>create note</Button>
        </div>
      </form>
    )
  }
  if (!podcastEpisode.noteId) {
    return <p>no note found for this episode</p>
  }
  const note = await getNote(podcastEpisode.noteId)
  if (!note) {
    return <p>no note found for this episode</p>
  }

  return (
    <Textarea
      note={{
        id: note.id,
        title: episode.trackName,
        body: note.body,
        text: `${episode.trackName}\n\n${note?.body}`,
      }}
    />
  )
}
