import qs from 'qs'
import 'whatwg-fetch'

const handleApiResponse = async (response) => {
  const responseBody = response.headers.get('Content-Length')
    ? await response.json()
    : await Promise.resolve({ error: 'An unknown error occurred' })

  if (!response.ok) throw new Error(responseBody.error)

  return responseBody.data
}

const BASE_REQUEST_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
}

const del = async (path) => {
  const response = await fetch(path, {
    ...BASE_REQUEST_OPTIONS,
    method: 'DELETE',
  })

  return handleApiResponse(response)
}

const get = async (path, queryParams = {}) => {
  const response = await fetch(`${path}${qs.stringify(queryParams)}`, {
    ...BASE_REQUEST_OPTIONS,
    method: 'GET',
  })

  return handleApiResponse(response)
}

const patch = async (path, params) => {
  const response = await fetch(path, {
    ...BASE_REQUEST_OPTIONS,
    method: 'PATCH',
    body: JSON.stringify(params),
  })

  return handleApiResponse(response)
}

const post = async (path, params) => {
  const response = await fetch(path, {
    ...BASE_REQUEST_OPTIONS,
    method: 'POST',
    body: JSON.stringify(params),
  })

  return handleApiResponse(response)
}

const http = {
  delete: del,
  get,
  patch,
  post,
}

export default http
