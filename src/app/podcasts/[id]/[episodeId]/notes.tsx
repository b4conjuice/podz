'use client'

import useLocalStorage from '@/lib/useLocalStorage'

export default function Notes({ episodeId }: { episodeId: string }) {
  const [text, setText] = useLocalStorage(`episode-${episodeId}-notes`, '')
  return (
    <textarea
      className='h-full w-full flex-grow bg-cobalt'
      value={text}
      onChange={e => {
        setText(e.target.value)
      }}
    />
  )
}
