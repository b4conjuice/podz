import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { auth } from '@clerk/nextjs/server'

import { Main } from '@/components/ui'
import Textarea from '@/app/_components/textarea'
import { getNote } from '@/server/queries'

export default async function NotePage({ params }: { params: { id: string } }) {
  const user = auth()
  if (!user.userId) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>you must be logged in to view this note</p>
      </Main>
    )
  }
  const note = await getNote(Number(params.id))
  if (!note) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>no note found</p>
      </Main>
    )
  }
  return (
    <>
      <Main className='container mx-auto flex max-w-screen-md flex-col'>
        <div className='flex w-full flex-grow flex-col space-y-4'>
          {/* <Link // TODO: Maybe add back podcast link?
          href={`/podcasts/${params.id}`}
          className='text-cb-pink hover:text-cb-pink/75'
        >
          {podcast.trackName}
        </Link> */}
          <h2 className='px-4'>{note.title}</h2>
          <Textarea
            note={{
              id: note.id,
              title: note.title,
              body: note.body,
              text: `${note.title}\n\n${note?.body}`,
              list: note.list,
              tags: note.tags,
            }}
          />
        </div>
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-4 pt-2'>
        <div className='flex space-x-4'>
          <Link href='/' className='text-cb-yellow hover:text-cb-yellow/75'>
            <ChevronLeftIcon className='h-6 w-6' />
          </Link>
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
