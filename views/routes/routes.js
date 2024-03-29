import qs from 'qs'

const apiPath = '/api/v1'

export const routes = {
  admin: '/admin',
  charts: '/charts',
  configurations: '/configurations',
  contactUs: '/contact-us',
  dashboard: (study = ':study', subject = ':subject') =>
    `${routes.dashboards}/${study}/${subject}`,
  dashboards: `/dashboard`,
  editChart: (chartId) => `/charts/${chartId}/edit`,
  editChartPage: '/charts/:chart_id/edit',
  editConfigPage: '/config/:config_id/edit',
  editConfiguration: (configId) => `/config/${configId}/edit`,
  help: '/help',
  home: `/`,
  logout: '/logout',
  main: '/main',
  newChart: '/charts/new',
  newConfiguration: '/configs/new',
  participants: '/participants',
  privacyPolicy: '/privacy-policy',
  previewProfile: '/preview-profile',
  termsOfUse: '/terms-of-use',
  resetpw: '/reset-password',
  register: '/register',
  signin: '/signin',
  studyDashboard: (study = ':study') => `${routes.dashboards}/${study}`,
  studies: '/studies',
  userAccount: '/user-account',
  viewChart: (chartId, queryParams) =>
    queryParams
      ? `/charts/${chartId}${qs.stringify(queryParams, {
          addQueryPrefix: true,
        })}`
      : `/charts/${chartId}`,
  viewChartPage: '/charts/:chart_id',
  viewConfiguration: (configId) => `/u/configure?s=view&id=${configId}`,
}

export const apiRoutes = {
  auth: {
    login: `${apiPath}/login`,
    logout: `${apiPath}/logout`,
    me: `${apiPath}/me`,
    resetPassword: `${apiPath}/resetpw`,
    signup: `${apiPath}/signup`,
  },
  admin: {
    users: {
      show: (uid) => `${apiPath}/admin/users/${uid}`,
    },
    studies: {
      all: `${apiPath}/admin/search/studies`,
    },
  },
  chartData: {
    show: (chartId) => `${apiPath}/charts/${chartId}/data`,
  },
  chartCsv: {
    show: (chartId, queryParams) =>
      queryParams
        ? `${apiPath}/charts/${chartId}/data?${qs.stringify(queryParams)}`
        : `${apiPath}/charts/${chartId}/data`,
  },
  configurations: {
    userConfigurations: (uid) => `${apiPath}/users/${uid}/configs`,
    userConfiguration: (uid, config_id) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/${config_id}`,
    configurationFileUpload: (uid) =>
      `${apiRoutes.configurations.userConfigurations(uid)}/file`,
  },
  dashboards: {
    show: (study = ':study', subject = ':subject') =>
      `${apiPath}/dashboards/${study}/${subject}`,
  },
  participants: {
    index: `${apiPath}/participants`,
  },
  users: {
    index: `${apiPath}/users`,
    show: (uid) => `${apiPath}/users/${uid}`,
  },
  chart: {
    show: (chart_id) => `${apiPath}/charts/${chart_id}`,
    index: `${apiPath}/charts`,
  },
  shareChart: {
    show: (chart_id) => `${apiPath}/charts/${chart_id}/share`,
  },
  duplicateChart: {
    show: `${apiPath}/charts/duplicate`,
  },
  subjects: (studies) => `${apiPath}/subjects?q=${JSON.stringify(studies)}`,
  preferences: (uid) => `${apiPath}/users/${uid}/preferences`,
  subject: `${apiPath}/subjects`,
}
