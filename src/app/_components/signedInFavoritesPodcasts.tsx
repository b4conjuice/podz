import Search from './search'
import Favorites from './favorites'
import { getFavorites } from '@/server/queries'

export default async function SignedInFavoritePodcasts() {
  const favorites = await getFavorites()
  return (
    <>
      <Search favorites={favorites} />
      <Favorites favorites={favorites} />
    </>
  )
}
