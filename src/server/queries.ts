'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

import { type Podcast } from '@/lib/types'
import { db } from './db'
import { favorites } from './db/schema'

export async function getFavorites() {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const favorites = await db.query.favorites.findMany({
    where: (model, { eq }) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) => desc(model.id),
  })
  return favorites.map(favorite => ({
    trackId: favorite.trackId,
    trackName: favorite.trackName,
    artistName: favorite.artistName,
    trackViewUrl: favorite.trackViewUrl,
    primaryGenreName: favorite.primaryGenreName,
    userId: user.userId,
  }))
}

export async function addFavorite(podcast: Podcast, currentPath = '/') {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const favorite = {
    trackId: podcast.trackId,
    trackName: podcast.trackName,
    artistName: podcast.artistName,
    trackViewUrl: podcast.trackViewUrl,
    primaryGenreName: podcast.primaryGenreName,
    userId: user.userId,
  }

  await db.insert(favorites).values(favorite)
  revalidatePath(currentPath)
}
export async function deleteFavorite(id: number, currentPath = '/') {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  await db
    .delete(favorites)
    .where(and(eq(favorites.trackId, id), eq(favorites.userId, user.userId)))
    .returning({ deletedId: favorites.id })

  revalidatePath(currentPath)
}
