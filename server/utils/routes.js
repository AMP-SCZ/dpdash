const v1Root = `/api/v1`
const userRoot = `${v1Root}/users/:uid`

export const routes = {
  root: `/`,
  chart: '/charts/data/:chart_id',
  charts: '/charts',
  editChart: '/charts/:chart_id/edit',
  newChart: '/charts/new',
  login: `/login`,
  signup: `/signup`,
  logout: `/logout`,
}

export const v1Routes = {
  auth: {
    login: `${v1Root}/login`,
    me: `${v1Root}/me`,
  },
  config: {
    index: `${userRoot}/configs`,
    show: `${userRoot}/configs/:config_id`,
  },
  users: {
    show: userRoot,
  },
  auth: {
    login: `${v1Root}/login`,
  },
  charts: {
    show: `${v1Root}/data/charts/:chart_id`,
  },
}
