'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

import { type Note, type Podcast } from '@/lib/types'
import { db } from './db'
import { favorites, notes } from './db/schema'

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

export async function toggleFavorite(podcast: Podcast, currentPath = '/') {
  const favorites = await getFavorites()
  const isFavorite = favorites.find(f => f.trackId === podcast.trackId)
  if (isFavorite) {
    await deleteFavorite(podcast.trackId, currentPath)
  } else {
    await addFavorite(podcast, currentPath)
  }
}

export async function saveNote(note: Note, currentPath = '/') {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  await db
    .insert(notes)
    .values({
      ...note,
      author: user.userId,
    })
    .onConflictDoUpdate({
      target: notes.id,
      set: {
        text: note.text,
        title: note.title,
        body: note.body,
      },
    })
  revalidatePath(currentPath)
}

export async function getNotes() {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const notes = await db.query.notes.findMany({
    where: (model, { eq }) => eq(model.author, user.userId),
    orderBy: (model, { desc }) => desc(model.updatedAt),
  })
  return notes
}

export async function getNote(podcastEpisodeId: number) {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const note = await db.query.notes.findFirst({
    where: (model, { eq }) =>
      and(
        eq(model.podcastEpisodeId, podcastEpisodeId),
        eq(model.author, user.userId)
      ),
  })

  return note
}

export async function deleteNote(id: number, currentPath = '/') {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.author, user.userId)))
  revalidatePath(currentPath)
}
