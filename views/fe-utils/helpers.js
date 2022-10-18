export const formatAsPercentage = (value = 0) => value.toFixed(0) + '%'

export const studyCountsToPercentage = (studyCount, targetTotal) => {
  if (!targetTotal || Number.isNaN(+studyCount) || Number.isNaN(+targetTotal)) {
    return 0
  }

  return (+studyCount / +targetTotal) * 100
}

export const formatTooltipData = (studyCounts = 0, studyTargets) =>
  !!studyTargets ? `${studyCounts} / ${studyTargets}` : `${studyCounts}`