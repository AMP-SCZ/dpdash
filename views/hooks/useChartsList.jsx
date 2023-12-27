import { useState, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import api from '../api'

const NULL_CHART = {}

export default function useChartsList() {
  const { setNotification, setUser, user, users } = useOutletContext()
  const { uid, favoriteCharts } = user
  const favoriteChartsSet = new Set(favoriteCharts)

  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchOptions, setSearchOptions] = useState([])
  const [searchedCharts, setSearchedCharts] = useState([])
  const [usernames, setUsernames] = useState([])

  const closeDialog = () => setChartToShare(NULL_CHART)
  const onShare = (chart) => setChartToShare(chart)
  const shareWithUsers = async (chart_id, sharedWith, options = {}) => {
    try {
      await api.charts.chartsShare.create(chart_id, sharedWith)

      const updatedChart = { ...chartToShare, sharedWith }
      const updatedChartList = chartList.map((chart) =>
        chart._id === updatedChart._id ? updatedChart : chart
      )

      setChartList(updatedChartList)
      options.closeDialog ? closeDialog() : setChartToShare(updatedChart)
      setNotification({ open: true, message: 'Shared chart with user' })
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onDelete = async (chart) => {
    try {
      await api.charts.chart.destroy(chart._id)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onDuplicate = async (chart) => {
    try {
      await api.charts.chartsDuplicate.create(chart._id)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const onFavorite = async (chart) => {
    try {
      const isChartInSet = favoriteChartsSet.has(chart._id)

      isChartInSet
        ? favoriteChartsSet.delete(chart._id)
        : favoriteChartsSet.add(chart._id)

      const updatedUser = await api.users.update(uid, {
        ...user,
        favoriteCharts: Array.from(favoriteChartsSet),
      })

      setUser(updatedUser)

      await loadCharts()
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }
  const loadCharts = async () => {
    try {
      const chartParams = {
        ...(searchedCharts
          ? { searchedCharts: searchedCharts.map(({ value }) => value) }
          : {}),
      }

      const data = await api.charts.chart.all(chartParams)

      setChartList(data)

      return data
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  const handleSearch = async (formData) => setSearchedCharts(formData.charts)

  useEffect(() => {
    loadCharts().then((initialCharts) => {
      if (initialLoad) {
        const searchDropdownOptions = initialCharts.map((chart) => {
          return {
            label: chart.title,
            value: chart._id,
          }
        })

        setSearchOptions(searchDropdownOptions)
        setInitialLoad(false)
      }
    })
  }, [searchedCharts])

  useEffect(() => {
    const apiUsernames = users
      .filter(({ uid }) => uid !== user.uid)
      .map(({ uid }) => ({
        value: uid,
        label: uid,
      }))

    setUsernames(apiUsernames)
  }, [users])

  return {
    charts: chartList,
    chartToShare,
    closeDialog,
    handleSearch,
    onFavorite,
    onShare,
    onDelete,
    onDuplicate,
    searchOptions,
    searchedCharts,
    shareWithUsers,
    user,
    usernames,
  }
}
