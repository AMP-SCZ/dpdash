import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import api from '../api'

const NULL_CHART = {}

export default function useChartsList() {
  const { user, setNotification, users } = useOutletContext()
  const [chartToShare, setChartToShare] = useState(NULL_CHART)
  const [chartList, setChartList] = useState([])
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
  const loadCharts = async () => {
    try {
      const data = await api.charts.chart.index()

      setChartList(data)
    } catch (error) {
      setNotification({ open: true, message: error.message })
    }
  }

  useEffect(() => {
    loadCharts()
  }, [])

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
    onShare,
    onDelete,
    onDuplicate,
    shareWithUsers,
    user,
    usernames,
  }
}