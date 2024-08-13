import { Main, Title } from '@/components/ui'
import Search from './_components/search'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex w-full flex-grow flex-col items-center space-y-4'>
        <Title>podz</Title>
        <Search />
      </div>
    </Main>
  )
}
