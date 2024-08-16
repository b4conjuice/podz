export const LOOKUP_PODCAST_EPISODES_API = (podcastId: string) =>
  `https://itunes.apple.com/lookup?id=${podcastId}&country=US&entity=podcastEpisode`
