import React from 'react'

import Matrix from './Matrix.d3'

const GraphFactory = (props) => {
  const { data } = props
  const graph = React.createRef()
  const domNode = React.useRef()

  React.useEffect(() => {
    if (domNode.current) {
      graph.current = new Matrix(domNode.current, props)
      graph.current.create(props.data)
    }
  }, [])

  React.useEffect(() => {
    if (!!data && Object.keys(data).length > 0) {
      const currentGraph = domNode.current?.firstChild

      if (currentGraph) {
        domNode.current.removeChild(currentGraph)
      }

      graph.current = new Matrix(domNode.current, props)
      graph.current.create(data)
    }
  }, [data])

  return <div className="graph" ref={domNode}></div>
}

export default GraphFactory
