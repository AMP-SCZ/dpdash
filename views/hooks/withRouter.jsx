import { useLocation, useParams } from 'react-router-dom'

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const params = useParams()
    console.log(props)
    return <Component params={params} {...props} />
  }

  return Wrapper
}
