import { Main } from '@/components/ui'
import Textarea from '@/app/_components/textarea'
import { getNote } from '@/server/queries'

export default async function NotePage({ params }: { params: { id: string } }) {
  const note = await getNote(Number(params.id))
  if (!note) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>no note found</p>
      </Main>
    )
  }
  return (
    <Main className='container mx-auto flex max-w-screen-md flex-col px-4 pb-4 md:px-0'>
      <div className='flex w-full flex-grow flex-col space-y-4'>
        {/* <Link // TODO: Maybe add back podcast link?
          href={`/podcasts/${params.id}`}
          className='text-cb-pink hover:text-cb-pink/75'
        >
          {podcast.trackName}
        </Link> */}
        <h2>{note.title}</h2>
        <Textarea
          note={{
            id: note.id,
            title: note.title,
            body: note.body,
            text: `${note.title}\n\n${note?.body}`,
          }}
        />
      </div>
    </Main>
  )
}
