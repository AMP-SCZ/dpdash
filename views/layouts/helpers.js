export const headerTitle = (pathname) => {
  switch (true) {
    case pathname === '/configs':
      return 'Configurations'
    default:
      return 'DpDash'
  }
}
