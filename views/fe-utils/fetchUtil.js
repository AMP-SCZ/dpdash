import basePathConfig from '../../server/configs/basePathConfig'
import { routes, defaultApiOptions, apiRoutes } from '../routes/routes'
const basePath = basePathConfig || ''

const fetchStudiesAdmin = async () => {
  const res = await window.fetch(`${basePath}/api/v1/search/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchStudies = async () => {
  const res = await window.fetch(`${basePath}/api/v1/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchSubjects = async () => {
  const userAccess = await window.fetch(`${basePath}/api/v1/studies`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (userAccess.status !== 200) {
    throw new Error(userAccess.statusText)
  }
  const studiesJson = await userAccess.json()
  const studies = studiesJson ? studiesJson : []
  const subjectsResponse = await window.fetch(apiRoutes.subjects(studies), {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (subjectsResponse.status !== 200) {
    throw new Error(subjectsResponse.statusText)
  }
  return subjectsResponse.json()
}

const fetchUsers = async () => {
  const res = await window.fetch(`${basePath}/api/v1/users`, {
    ...defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchUsernames = async () => {
  const res = await window.fetch(`${basePath}/api/v1/search/users`, {
    defaultApiOptions,
    method: 'GET',
  })
  if (res.status !== 200) {
    throw new Error(res.statusText)
  }
  return res.json()
}

const fetchStudyDetails = async () => {
  const res = await window.fetch(apiRoutes.studyDetails, {
    ...defaultApiOptions,
    method: 'GET',
  })

  return res.json()
}

const createStudyDetails = async (body) => {
  const res = await window.fetch(apiRoutes.studyDetails, {
    ...defaultApiOptions,
    method: 'POST',
    body: JSON.stringify(body),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const deleteStudyDetails = async (id) => {
  const res = await window.fetch(apiRoutes.studyDetail(id), {
    ...defaultApiOptions,
    method: 'DELETE',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const createChart = async (formValues) => {
  const res = await window.fetch(apiRoutes.charts, {
    ...defaultApiOptions,
    method: 'POST',
    body: JSON.stringify(formValues),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const getCharts = async () => {
  const res = await window.fetch(apiRoutes.charts, {
    ...defaultApiOptions,
    method: 'GET',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const deleteChart = async (id) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'DELETE',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const editChart = async (id, formValues) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'PUT',
    body: JSON.stringify(formValues),
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const getChart = async (id) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'GET',
  })

  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

const duplicateChart = async (id) => {
  const res = await window.fetch(apiRoutes.chart(id), {
    ...defaultApiOptions,
    method: 'PATCH',
  })
  if (res.status !== 200) return new Error(res.message)

  return res.json()
}

export {
  fetchStudies,
  fetchStudiesAdmin,
  fetchSubjects,
  fetchUsers,
  fetchUsernames,
  fetchStudyDetails,
  deleteStudyDetails,
  createStudyDetails,
  createChart,
  getCharts,
  deleteChart,
  editChart,
  getChart,
  duplicateChart,
}
