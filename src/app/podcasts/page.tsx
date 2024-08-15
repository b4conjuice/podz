import { Main, Title } from '@/components/ui'
import { getFavorites } from '@/server/queries'
import Search from '../_components/search'

export default async function PodcastsPage() {
  const favorites = await getFavorites()
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <Title>podz</Title>
        <Search favorites={favorites} />
      </div>
    </Main>
  )
}
