import { Button } from '@/components/ui'
import { type PodcastEpisode } from '@/lib/types'
import { getNote, saveNote } from '@/server/queries'

export default async function Notes({ episode }: { episode: PodcastEpisode }) {
  const note = await getNote(episode.trackId)
  const handleSubmit = async (formData: FormData) => {
    'use server'
    const title = episode.trackName
    const body = formData.get('body') as string
    const text = `${title}\n\n${body}`
    const newNote = {
      id: note?.id,
      podcastEpisodeId: episode.trackId,
      text,
      title,
      body,
    }
    await saveNote(newNote)
  }
  return (
    <form className='flex flex-grow flex-col' action={handleSubmit}>
      <div className='flex flex-grow flex-col space-y-4'>
        <textarea
          className='h-full w-full flex-grow bg-cobalt'
          name='body'
          defaultValue={note?.body}
        />
        <Button type='submit'>Save</Button>
      </div>
    </form>
  )
}
