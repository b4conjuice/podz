'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useDebounce } from '@uidotdev/usehooks'

import { type EditableNote } from '@/lib/types'
import { saveNote } from '@/server/queries'

export default function Textarea({ note }: { note: EditableNote }) {
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
    if (isSignedIn && debouncedBody !== note.body) {
      void updateNote()
    }
  }, [debouncedBody])
  return (
    <textarea
      className='w-full flex-grow border-cobalt bg-cobalt caret-cb-yellow focus:border-cb-light-blue focus:ring-0'
      name='body'
      value={body}
      onChange={e => {
        setBody(e.target.value)
      }}
    />
  )
}
