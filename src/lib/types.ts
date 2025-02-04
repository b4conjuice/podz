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

export type EditableNote = {
  id?: number
  text: string
  title: string
  body: string
  tags: string[]
}

export type Note = {
  author: string
} & EditableNote
