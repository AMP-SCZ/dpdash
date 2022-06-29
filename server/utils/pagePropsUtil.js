export const userProps = (req) => {
  const { user, session: { role, display_name, icon }} = req
  
  return {
    uid: user,
    name: display_name,
    role, 
    icon,
  }
}
