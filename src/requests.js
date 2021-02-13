import hash from 'object-hash'
import { GAME_VALUES } from './constants'

const graphQl = async (type, query) => {
  const url = import.meta.env.SNOWPACK_PUBLIC_API_URL
  const response = await fetch(url + '/graphQl', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `${type} ${query}`,
      verificationHash: hash({query: `${type} ${query}`, key: import.meta.env.SNOWPACK_PUBLIC_SECRET_KEY })
    })
  })
  if (response.ok) {
    return response.json()
  }
  throw response
}

export const uploadScore = async ({score, duration, username = GAME_VALUES.USERNAME_PLACEHOLDER}) => {
  const type = 'mutation'
  const query = `
    {
      createScore(score: ${score}, username: "${username}", duration: ${duration}) {
        id
        score
        username
        duration
        date
      }
    }
  `
  const res = await graphQl(type, query)
  return res?.data?.createScore
}

export const updateUsername = async ({id, username}) => {
  const type = 'mutation'
  const query = `
  {
    updateScore(id: ${id}, username: "${username}") {
      username
      score
    }
  }
  `
  const res = await graphQl(type, query)
  return res?.data?.uploadScore
}

export const getHighscores = async () => {
  const type = 'query'
  const query = `
    {
      getHighscores {
        id
        score
        username
        duration
        date
      }
    }
  `
  const res = await graphQl(type, query)
  return res?.data?.getHighscores
}

