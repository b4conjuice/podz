import Link from 'next/link'
import { ChevronLeftIcon, PencilSquareIcon } from '@heroicons/react/20/solid'
import { format, isThisYear } from 'date-fns'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { Main } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type PodcastEpisodesResponse } from '@/lib/types'
import { LOOKUP_PODCAST_EPISODES_API } from '@/lib/api'
import ToggleFavoritesButton from '@/app/_components/toggleFavoritesButton'
import TopNav from '@/app/_components/topNav'
import {
  getPodcastEpisodeRelations,
  saveNote,
  savePodcastEpisodeRelation,
} from '@/server/queries'

export default async function PodcastPage({
  params,
}: {
  params: { id: string }
}) {
  const podcastId = Number(params.id)
  const podcastResponse = await fetcher<PodcastEpisodesResponse>(
    LOOKUP_PODCAST_EPISODES_API({ podcastId }),
    { cache: 'no-store' }
  )
  const [podcast, ...maybePodcastEpisodes] = podcastResponse.results
  if (!podcast) {
    return (
      <>
        <TopNav />
        <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
          <p>no podcast found</p>
        </Main>
      </>
    )
  }
  const podcastEpisodeRelations = await getPodcastEpisodeRelations({
    podcastId,
  })
  const podcastEpisodes = (maybePodcastEpisodes ?? []).map(podcastEpisode => ({
    ...podcastEpisode,
    hasNote: Boolean(
      podcastEpisodeRelations.find(
        podcastEpisodeRelation =>
          podcastEpisodeRelation.podcastEpisodeId === podcastEpisode.trackId
      )
    ),
  }))
  return (
    <>
      <TopNav>
        <div className='flex items-center space-x-4'>
          <h2>{podcast.trackName}</h2>
          <ToggleFavoritesButton podcast={podcast} />
        </div>
      </TopNav>
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <div className='flex flex-grow flex-col space-y-4'>
          {podcastEpisodes.length && podcastEpisodes.length > 0 ? (
            <ul className='divide-y divide-cb-dusty-blue'>
              {podcastEpisodes.map(podcastEpisode => (
                <li key={podcastEpisode.trackId} className='group flex'>
                  {podcastEpisode.hasNote ? (
                    <Link
                      href={`/podcasts/${podcastId}/${podcastEpisode.trackId}`}
                      className='block grow py-4 text-cb-pink hover:text-cb-pink/75 group-first:pt-0'
                    >
                      <div>{podcastEpisode.trackName}</div>
                      <div className='text-sm text-cb-white'>
                        {format(
                          podcastEpisode.releaseDate,
                          isThisYear(podcastEpisode.releaseDate)
                            ? 'MMM d'
                            : 'MMM d, yyyy'
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className='flex w-full py-4 group-first:pt-0'>
                      <div className='grow'>
                        <div>{podcastEpisode.trackName}</div>
                        <div className='text-sm text-cb-white'>
                          {format(
                            podcastEpisode.releaseDate,
                            isThisYear(podcastEpisode.releaseDate)
                              ? 'MMM d'
                              : 'MMM d, yyyy'
                          )}
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <form
                          action={async () => {
                            'use server'
                            'use server'
                            const title = podcastEpisode.trackName
                            const body = ''
                            const text = `${title}\n\n${body}`
                            const newNote = {
                              text,
                              title,
                              body,
                              list: [],
                              tags: [],
                            }
                            const noteId = await saveNote(newNote)
                            const newPodcastEpisode = {
                              podcastId,
                              podcastEpisodeId: podcastEpisode.trackId,
                              noteId,
                            }
                            await savePodcastEpisodeRelation(newPodcastEpisode)
                            revalidatePath(`/podcasts/${podcastId}`)
                            redirect(
                              `/podcasts/${podcastId}/${podcastEpisode.trackId}`
                            )
                          }}
                        >
                          <button
                            type='submit'
                            tabIndex={-1}
                            className='text-cb-yellow hover:text-cb-yellow/75'
                          >
                            <PencilSquareIcon className='h-6 w-6' />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>search for podcasts</p>
          )}
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
