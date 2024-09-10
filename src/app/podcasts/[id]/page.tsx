import Link from 'next/link'
import { format, isThisYear } from 'date-fns'

import { Main } from '@/components/ui'
import fetcher from '@/lib/fetcher'
import { type PodcastEpisodesResponse } from '@/lib/types'
import { LOOKUP_PODCAST_EPISODES_API } from '@/lib/api'
import ToggleFavoritesButton from '@/app/_components/toggleFavoritesButton'

export default async function PodcastPage({
  params,
}: {
  params: { id: string }
}) {
  const podcastResponse = await fetcher<PodcastEpisodesResponse>(
    LOOKUP_PODCAST_EPISODES_API(params.id),
    { cache: 'no-store' }
  )
  const [podcast, ...podcastEpisodes] = podcastResponse.results
  if (!podcast) {
    return (
      <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
        <p>no podcast found</p>
      </Main>
    )
  }
  return (
    <Main className='container mx-auto flex max-w-screen-md flex-col px-4 md:px-0'>
      <div className='flex flex-grow flex-col space-y-4'>
        <div className='flex items-center space-x-4'>
          <h2>{podcast.trackName}</h2>
          <ToggleFavoritesButton podcast={podcast} />
        </div>
        {podcastEpisodes?.length && podcastEpisodes?.length > 0 ? (
          <ul className='divide-y divide-cb-dusty-blue'>
            {podcastEpisodes.map(podcastEpisode => (
              <li key={podcastEpisode.trackId} className='py-4 first:pt-0'>
                <Link
                  href={`/podcasts/${params.id}/${podcastEpisode.trackId}`}
                  className='text-cb-pink hover:text-cb-pink/75'
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
