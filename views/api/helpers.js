export const handleApiResponse = async (response) => {
  if (response.status !== 200 && response.status !== 204)
    throw new Error(jsonResponse.error)

  if (response.status === 204) return

  const jsonResponse = await response.json()

  return jsonResponse.data
}
