import { useLocation, useParams } from 'react-router-dom'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const params = useParams()
    const location = useLocation()

    return <Component params={params} location={location} {...props} />
  }

  return Wrapper
}
