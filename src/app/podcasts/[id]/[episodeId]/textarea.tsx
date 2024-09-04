'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useDebounce } from '@uidotdev/usehooks'

import { type Note } from '@/lib/types'
import { saveNote } from '@/server/queries'

export default function Textarea({ note }: { note: Note }) {
  const { isSignedIn } = useAuth()
  const [body, setBody] = useState(note.body)
  const debouncedBody = useDebounce(body, 500)
  useEffect(() => {
    async function updateNote() {
      const updatedNote = {
        ...note,
        body,
        text: `${note?.title ?? ''}\n\n${body}`,
      }
      await saveNote(updatedNote)
    }
    if (isSignedIn) {
      void updateNote()
    }
  }, [debouncedBody])
  return (
    <textarea
      className='h-full w-full flex-grow bg-cobalt'
      name='body'
      value={body}
      onChange={e => {
        setBody(e.target.value)
      }}
    />
  )
}
