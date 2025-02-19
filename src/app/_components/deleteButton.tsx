'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from '@heroicons/react/20/solid'

import { Button, Modal } from '@/components/ui'
import { deleteNote, deleteNoteByEpisodeId } from '@/server/queries'
import { type PodcastEpisode } from '@/lib/types'

type Params =
  | {
      podcastEpisode: PodcastEpisode
      podcastId: number
    }
  | { noteId: number }

export default function DeleteButton(params: Params) {
  const router = useRouter()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  return (
    <>
      <button
        className='text-red-600 hover:text-red-600/75 disabled:pointer-events-none disabled:text-cb-light-blue'
        type='button'
        onClick={() => {
          setIsConfirmModalOpen(true)
        }}
      >
        <TrashIcon className='h-6 w-6' />
      </button>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to delete?'
      >
        <div className='flex space-x-4'>
          <Button
            onClick={async () => {
              if ('podcastEpisode' in params) {
                await deleteNoteByEpisodeId(params.podcastEpisode.trackId, '/')
                setIsConfirmModalOpen(false)
                router.push(`/podcasts/${params.podcastId}`)
              }
              if ('noteId' in params) {
                await deleteNote(params.noteId, '/')
                setIsConfirmModalOpen(false)
                router.push('/')
              }
            }}
          >
            yes
          </Button>
          <Button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            no
          </Button>
        </div>
      </Modal>
    </>
  )
}
