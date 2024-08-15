import { Main, Title } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'
import Notes from './notes'

type PodcastEpisode = {
  trackId: number
  trackName: string
  shortDescription: string
  description: string
  trackViewUrl: string
}

type PodcastResponse = {
  resultCount: number
  results: Array<Podcast | PodcastEpisode>
}

const LOOKUP_PODCAST_EPISODES_API = (podcastId: string) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&country=US&entity=podcastEpisode`

export default async function EpisodePage({
  params,
}: {
  params: { id: string; episodeId: string }
}) {
  const podcastResponse = await fetcher<PodcastResponse>(
    LOOKUP_PODCAST_EPISODES_API(params.id)
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
      <Main className='flex flex-col px-4'>
        <p>no podcast found</p>
      </Main>
    )
  }
  return (
    <Main className='flex flex-col px-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <h2>{podcastEpisode.trackName}</h2>
        <Notes episodeId={params.episodeId} />
      </div>
    </Main>
  )
}
