'use client'

import { useUser } from '@clerk/nextjs'

export default function Username() {
  const { user } = useUser()
  return <span>{user?.username}</span>
}
