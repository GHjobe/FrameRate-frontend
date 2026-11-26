import { delay } from './client'
import { movies, genres } from '@/mocks/movies'
import { forYou } from '@/mocks/forYou'

export const getMovies = () => delay(movies)
export const getTopRated = () => delay([...movies].sort((a, b) => b.score - a.score))
export const getPopular = () => delay([...movies].sort((a, b) => b.ratings - a.ratings))
export const getRecommended = () => delay(movies.slice(0, 5))
// Movies for the For You page, each with `match` (percent) and `reason`, best match first.
export const getForYou = () =>
  delay(
    forYou
      .map((r) => {
        const movie = movies.find((m) => m.id === r.movieId)
        return movie ? { ...movie, match: r.match, reason: r.reason } : null
      })
      .filter(Boolean)
      .sort((a, b) => b.match - a.match),
  )
export const getFeatured = () => delay(movies.slice(0, 3))
export const getGenres = () => delay(genres)
export const getMovie = (id) => delay(movies.find((m) => m.id === Number(id)) ?? null)
export const getSimilarMovies = (id) => delay(movies.filter((m) => m.id !== Number(id)).slice(0, 4))
export const searchMovies = (query) => {
  const q = query.trim().toLowerCase()
  return delay(q ? movies.filter((m) => m.title.toLowerCase().includes(q)) : [])
}