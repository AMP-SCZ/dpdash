import basePathConfig from '../configs/basePathConfig'
const basePath = basePathConfig || ''

export const routes = {
  root: basePath + '/',
  charts: '/charts',
  logout: `${basePath}/logout`,
  login: `${basePath}/login`,
  rootWithError: (err) => `${basePath}?e=${err}`,
  logoutWithError: (err) => `${basePath}/logout?e=${err}`,
  loginWithError: (err) => `${basePath}/login?e=${err}`,
  resetPwWithError: (err) => `${basePath}/resetpw?e=${err}`,
  signUpWithError: (err) => `${basePath}/signup?e=${err}`,
}

export const routerRoutes = {
  userSiteSubjects: `/api/v1/users/:uid/site-subjects`,
  userSiteSubjectsStar: '/api/v1/user/:uid/site-subjects/star',
  userSiteSubjectsComplete: '/api/v1/user/:uid/site-subjects/complete',
}

export const routeErrors = {
  forbidden: 'forbidden',
  db: 'db',
  N_A: 'NA',
  unmatched: 'unmatched',
  unauthorized: 'unathorized',
  resetpw: 'resetpw',
  noUser: 'nouser',
  existingUser: 'existingUser',
}
