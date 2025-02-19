export const LOOKUP_PODCAST_EPISODES_API = (podcastId: number) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&country=US&entity=podcastEpisode`
