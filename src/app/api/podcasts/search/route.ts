import { type NextRequest } from 'next/server'

import fetcher from '@/lib/fetcher'
import { type Podcast } from '@/lib/types'

type PodcastAPIResponse = {
  resultCount: number
  results: Podcast[]
}

const SEARCH_PODCASTS_API = (term: string) =>
  `https://itunes.apple.com/search?country=US&media=podcast&term=${term}`

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const term = searchParams.get('term')
  if (term === null) {
    return Response.json([])
  }
  const response = await fetcher<PodcastAPIResponse>(SEARCH_PODCASTS_API(term))
  const podcasts = response.results
  return Response.json(podcasts)
}
