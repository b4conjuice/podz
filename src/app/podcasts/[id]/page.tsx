import { Main, Title } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'

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

const SEARCH_PODCAST_EPISODES_API = (podcastId: string) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&country=US&entity=podcastEpisode`

export default async function PodcastPage({
  params,
}: {
  params: { id: string }
}) {
  const podcastResponse = await fetcher<PodcastResponse>(
    SEARCH_PODCAST_EPISODES_API(params.id)
  )
  const [podcast, ...podcastEpisodes] = podcastResponse.results
  if (!podcast) {
    return <p>no podcast found</p>
  }
  return (
    <Main className='flex flex-col px-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <Title>{podcast.trackName}</Title>
        {podcastEpisodes?.length && podcastEpisodes?.length > 0 ? (
          <ul className='divide-y divide-cb-dusty-blue'>
            {podcastEpisodes.map(podcastEpisode => (
              <li key={podcastEpisode.trackId} className='py-4 first:pt-0'>
                {podcastEpisode.trackName}
              </li>
            ))}
          </ul>
        ) : (
          <p>search for podcasts</p>
        )}
      </div>
    </Main>
  )
}
