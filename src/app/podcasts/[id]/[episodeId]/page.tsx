import Link from 'next/link'

import { Main } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type PodcastEpisodesResponse } from '@/lib/types'
import { LOOKUP_PODCAST_EPISODES_API } from '@/lib/api'
import Notes from './notes'

export default async function EpisodePage({
  params,
}: {
  params: { id: string; episodeId: string }
}) {
  const podcastResponse = await fetcher<PodcastEpisodesResponse>(
    LOOKUP_PODCAST_EPISODES_API(params.id),
    { cache: 'no-store' }
  )
  const [podcast, ...podcastEpisodes] = podcastResponse.results
  if (!podcast) {
    return (
      <Main className='flex flex-col px-4'>
        <p>no podcast found</p>
      </Main>
    )
  }
  const podcastEpisode = podcastEpisodes?.find(
    p => p.trackId === Number(params.episodeId)
  )
  if (!podcastEpisode) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>no podcast episode found</p>
      </Main>
    )
  }
  return (
    <Main className='container mx-auto flex max-w-screen-md flex-col px-4 pb-4 md:px-0'>
      <div className='flex w-full flex-grow flex-col space-y-4'>
        <Link
          href={`/podcasts/${params.id}`}
          className='text-cb-pink hover:text-cb-pink/75'
        >
          {podcast.trackName}
        </Link>
        <h2>{podcastEpisode.trackName}</h2>
        <Notes podcastId={Number(params.id)} episode={podcastEpisode} />
      </div>
    </Main>
  )
}
