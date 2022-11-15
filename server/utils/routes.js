import basePathConfig from '../configs/basePathConfig'
const basePath = basePathConfig || ''

export const routes = {
  charts: '/charts',
  logoutForbiddenRoute: `${basePath}/logout?e=forbidden`,
  unauthorizedRoute: `${basePath}/logout?e=unauthorized`,
  logout: `${basePath}/logout`,
  resetPw: `${basePath}/login?e=resetpw`,
  resetPwNoUser: `${basePath}/resetpw?e=nouser`,
  resetPwError: `${basePath}/resetpw?e=db`,
  resetPwErrorUnmatched: `${basePath}/resetpw?e=unmatched`,
}
