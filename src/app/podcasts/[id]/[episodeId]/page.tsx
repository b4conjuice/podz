import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

import { Main } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type PodcastEpisodesResponse } from '@/lib/types'
import { LOOKUP_PODCAST_EPISODES_API } from '@/lib/api'
import Notes from './notes'
import TopNav from '@/app/_components/topNav'
import DeleteButton from '@/app/_components/deleteButton'

export default async function EpisodePage({
  params,
}: {
  params: { id: string; episodeId: string }
}) {
  const podcastId = Number(params.id)
  const podcastResponse = await fetcher<PodcastEpisodesResponse>(
    LOOKUP_PODCAST_EPISODES_API({ podcastId }),
    { cache: 'no-store' }
  )
  const [podcast, ...podcastEpisodes] = podcastResponse.results
  if (!podcast) {
    return (
      <>
        <TopNav />
        <Main className='flex flex-col px-4'>
          <p>no podcast found</p>
        </Main>
      </>
    )
  }
  const podcastEpisode = podcastEpisodes?.find(
    p => p.trackId === Number(params.episodeId)
  )
  if (!podcastEpisode) {
    return (
      <>
        <TopNav />
        <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
          <p>no podcast episode found</p>
        </Main>
      </>
    )
  }
  return (
    <>
      <TopNav title={podcastEpisode.trackName} />
      <Main className='container mx-auto flex max-w-screen-md flex-col'>
        <div className='flex w-full flex-grow flex-col space-y-4'>
          <Notes podcastId={podcastId} episode={podcastEpisode} />
        </div>
      </Main>
      <footer className='sticky bottom-0 flex items-center justify-between bg-cb-dusty-blue px-2 pb-4 pt-2'>
        <div className='flex space-x-4'>
          <Link
            href={`/podcasts/${podcastId}`}
            className='flex items-center space-x-2 text-cb-yellow hover:text-cb-yellow/75'
          >
            <ChevronLeftIcon className='h-6 w-6' /> {podcast.trackName}
          </Link>
        </div>
        <div className='flex space-x-4'>
          <DeleteButton podcastEpisode={podcastEpisode} podcastId={podcastId} />
        </div>
      </footer>
    </>
  )
}
