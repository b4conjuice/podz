'use server'

import 'server-only'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'

import { type Note, type Podcast } from '@/lib/types'
import { db } from './db'
import { favorites, notes, podcastEpisodes } from './db/schema'

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

export async function saveNote(note: Note) {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const newNotes = await db
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
    .returning()

  if (!newNotes || newNotes.length < 0) throw new Error('something went wrong')
  const newNote = newNotes[0]
  if (!newNote) throw new Error('something went wrong')
  return newNote.id
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

export async function getNote(noteId: number) {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const note = await db.query.notes.findFirst({
    where: (model, { eq }) =>
      and(eq(model.id, noteId), eq(model.author, user.userId)),
  })

  return note
}

export async function deleteNote(id: number, currentPath = '/') {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  await db.delete(podcastEpisodes).where(and(eq(podcastEpisodes.noteId, id)))

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.author, user.userId)))
  revalidatePath(currentPath)
}

type PodcastEpisode = {
  podcastId: number
  podcastEpisodeId: number
  noteId: number
}

export async function getPodcastEpisodeRelation({
  podcastId,
  podcastEpisodeId,
}: {
  podcastId: number
  podcastEpisodeId: number
}) {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  const podcastEpisode = await db.query.podcastEpisodes.findFirst({
    where: (model, { eq }) =>
      and(
        eq(model.podcastId, podcastId),
        eq(model.podcastEpisodeId, podcastEpisodeId)
      ),
  })

  return podcastEpisode
}

export async function savePodcastEpisodeRelation(
  episode: PodcastEpisode,
  currentPath = '/'
) {
  const user = auth()

  if (!user.userId) throw new Error('unauthorized')

  await db.insert(podcastEpisodes).values({
    podcastId: episode.podcastId,
    podcastEpisodeId: episode.podcastEpisodeId,
    noteId: episode.noteId,
  })
  revalidatePath(currentPath)
}
