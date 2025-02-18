'use client'

import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/20/solid'

import { Button, Modal } from '@/components/ui'
import { deleteNoteByEpisodeId } from '@/server/queries'
import { useRouter } from 'next/navigation'
import { type PodcastEpisode } from '@/lib/types'

export default function DeleteButton({
  podcastEpisode,
  podcastId,
}: {
  podcastEpisode: PodcastEpisode
  podcastId: string
}) {
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
              console.log('to be deleted', podcastEpisode.trackId)
              await deleteNoteByEpisodeId(podcastEpisode.trackId, '/')
              setIsConfirmModalOpen(false)
              router.push(`/podcasts/${podcastId}`)
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
