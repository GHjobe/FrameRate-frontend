import { delay } from './client'
import { movies } from '@/mocks/movies'
import { friends, myRatings, party, groupQueue } from '@/mocks/party'

export const MAX_MEMBERS = 5

export function computeCompatibility(members, allMovies) {
  if (members.length < 2) return { percent: null, shared: 0 }
  const shared = allMovies.filter((m) => members.every((member) => member.ratings[m.id] != null))
  if (!shared.length) return { percent: null, shared: 0 }
  const closeness = shared.map((m) => {
    const stars = members.map((member) => member.ratings[m.id])
    return 1 - 0.2 * (Math.max(...stars) - Math.min(...stars))
  })
  const average = closeness.reduce((sum, c) => sum + c, 0) / closeness.length
  return { percent: Math.round(Math.max(0, average) * 100), shared: shared.length }
}

export function matchPercent(member, movie, allMovies) {
  const own = member.ratings[movie.id]
  if (own != null) return own * 20
  const related = allMovies.filter(
    (m) => m.id !== movie.id && member.ratings[m.id] != null && m.genres.some((g) => movie.genres.includes(g)),
  )
  if (!related.length) return 50
  const average = related.reduce((sum, m) => sum + member.ratings[m.id], 0) / related.length
  return Math.round(average * 20)
}

export function rankMovies(members, allMovies, queue = []) {
  return allMovies
    .map((movie) => {
      const matches = members.map((m) => ({
        username: m.username,
        isYou: m.isYou,
        percent: matchPercent(m, movie, allMovies),
      }))
      const average = matches.reduce((sum, x) => sum + x.percent, 0) / matches.length
      return { movie: { ...movie }, matches, average, inQueue: queue.includes(movie.id) }
    })
    .sort((a, b) => b.average - a.average || b.movie.score - a.movie.score || a.movie.title.localeCompare(b.movie.title))
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
}

const membersFor = (username) => [
  { username, isYou: true, ratings: myRatings },
  ...party
    .map((name) => friends.find((f) => f.username === name))
    .filter(Boolean)
    .map((f) => ({ username: f.username, isYou: false, ratings: f.ratings })),
]

export const getParty = (username) =>
  delay(membersFor(username).map(({ username: name, isYou }) => ({ username: name, isYou })))

export const getCompatibility = (username) => delay(computeCompatibility(membersFor(username), movies))

export const getRecommendations = (username) => delay(rankMovies(membersFor(username), movies, groupQueue))

export const addFriend = (name) => {
  const wanted = String(name ?? '').trim().toLowerCase()
  if (!wanted) return Promise.reject(new Error('Enter a username.'))
  const friend = friends.find((f) => f.username.toLowerCase() === wanted)
  if (!friend) return Promise.reject(new Error('No friend found with that username.'))
  if (party.includes(friend.username)) return Promise.reject(new Error(`${friend.username} is already in your party.`))
  if (party.length + 1 >= MAX_MEMBERS) return Promise.reject(new Error('Your party is full.'))
  party.push(friend.username)
  return delay({ username: friend.username, isYou: false })
}

export const addToGroupQueue = (movieId) => {
  if (!groupQueue.includes(movieId)) groupQueue.push(movieId)
  return delay(true)
}