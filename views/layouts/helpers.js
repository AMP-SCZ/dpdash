export const headerTitle = (pathname) => {
  switch (true) {
    case pathname === '/config':
      return 'Configurations'
    default:
      return 'DpDash'
  }
}
