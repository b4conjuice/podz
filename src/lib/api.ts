export const LOOKUP_PODCAST_EPISODES_API = ({
  podcastId,
  limit,
}: {
  podcastId: number
  limit?: number
}) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&country=US&entity=podcastEpisode${limit !== undefined ? `&limit=${limit}` : ''}`
