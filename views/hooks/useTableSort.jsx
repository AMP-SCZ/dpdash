import { useState } from 'react'

import { SORT_DIRECTION } from '../../constants'

export default function useTableSort(initialSortBy) {
  const [sortDirection, setDirection] = useState(SORT_DIRECTION.ASC)
  const [sortBy, setSortBy] = useState(initialSortBy)

  const onSort = (newSortBy, newSortDirection) => {
    if (newSortBy) setSortBy(newSortBy)
    if (newSortDirection) setDirection(newSortDirection)
  }

  return {
    onSort,
    sortDirection,
    sortBy,
  }
}
