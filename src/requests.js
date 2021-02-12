import hash from 'object-hash'
import { GAME_VALUES } from './constants'

const graphQl = async (type, query) => {
  const url = import.meta.env.SNOWPACK_PUBLIC_API_URL
  const response = await fetch(url + '', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `${type} ${query}`,
      verificationHash: hash({query: `${type} ${query}`, key: import.meta.env.SNOWPACK_PUBLIC_SECRET_KEY })
    })
  })
  return response.json()
}

export const uploadScore = async ({score, duration, username = GAME_VALUES.USERNAME_PLACEHOLDER}) => {
  const type = 'mutation'
  const query = `
    {
      addScore(score: "${score}", username: "${username}", duration: "${duration}") {
        id
        score
        username
        duration
        date
      }
    }
  `
  const res = await graphQl(type, query)
  return res?.data?.addScore
}

export const updateUsername = async ({id, username}) => {
  const type = 'mutation'
  const query = `
  {
    updateUsername(id: "${id}", username: "${username}") {
      username
      score
    }
  }
  `
  return graphQl(type, query)
}

export const getHighscores = async () => {
  const type = 'query'
  const query = `
    {
      highscores {
        id
        score
        username
        duration
        date
      }
    }
  `
  const res = await graphQl(type, query)
  return res?.data?.highscores
}

