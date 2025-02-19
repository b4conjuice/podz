import Link from 'next/link'
import { SignedIn } from '@clerk/nextjs'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import TopNav from '@/app/_components/topNav'
import { getNotes } from '@/server/queries'

async function Notes() {
  const notes = await getNotes()
  return (
    <>
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
  )
}

export default function Home() {
  return (
    <>
      <TopNav title='notes' />
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <div className='flex w-full flex-grow flex-col space-y-4'>
          <SignedIn>
            <Notes />
          </SignedIn>
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
