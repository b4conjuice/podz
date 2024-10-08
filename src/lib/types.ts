export type Podcast = {
  trackId: number
  trackName: string
  trackViewUrl: string
  artistName: string
  primaryGenreName: string
}

export type PodcastEpisode = {
  trackId: number
  trackName: string
  shortDescription: string
  description: string
  trackViewUrl: string
  releaseDate: string
}

export type PodcastEpisodesResponse = {
  resultCount: number
  results: [Podcast, ...Array<PodcastEpisode>]
}

export type Note = {
  id?: number
  podcastId: number
  podcastEpisodeId: number
  text: string
  title: string
  body: string
}
