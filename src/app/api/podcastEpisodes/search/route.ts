import { type NextRequest } from 'next/server'
import Fuse from 'fuse.js'

import fetcher from '@/lib/fetcher'
import { type PodcastEpisode } from '@/lib/types'
import { LOOKUP_PODCAST_EPISODES_API } from '@/lib/api'

type PodcastAPIResponse = {
  resultCount: number
  results: PodcastEpisode[]
}

const SEARCH_PODCAST_EPISODES = (term: string) =>
  `https://itunes.apple.com/search?country=US&media=podcast&term=${term}&entity=podcastEpisode`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const term = searchParams.get('term')
  const podcastId = Number(searchParams.get('podcastId'))
  if (!term || podcastId === null) {
    return Response.json([])
  }
  const response = await fetcher<PodcastAPIResponse>(
    LOOKUP_PODCAST_EPISODES_API({ podcastId, limit: 200 })
  )

  const allPodcastEpisodes = response.results
  const fuse = new Fuse(allPodcastEpisodes, {
    keys: ['trackName', 'description'],
  })
  const results = fuse.search(term).map(result => result.item)
  return Response.json(results)
}
