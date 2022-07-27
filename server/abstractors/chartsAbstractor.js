export const legend = (fieldValues) => fieldValues
.map(({fieldLabelValueMap: { label, color }}) => ({ 
  name: label, 
  symbol: { 
    type: 'square',
    fill: color
  }
}))

export const chartVariableColors = (fieldValues) => fieldValues.map(({ fieldLabelValueMap: { color }}) => color)

export const chartDataAbstractor = (individualCountsList, fieldValues) => Object
  .values(individualCountsList
  .reduce(function (currentSiteData, nextSiteData) {
    currentSiteData[nextSiteData.fieldLabel] = currentSiteData[nextSiteData.fieldLabel] || [];
    currentSiteData[nextSiteData.fieldLabel].push(nextSiteData);

  return currentSiteData;
  }, {}))
  .map((groupedCounts) => 
    Object
    .values(groupedCounts
    .reduce((currentSite, nextSite) => {
      currentSite[nextSite.siteName] = currentSite[nextSite.siteName]
      ? { 
          ...nextSite, 
          count: nextSite.count + currentSite[nextSite.siteName].count, 
          current: nextSite.count + currentSite[nextSite.siteName].count,  
          target: nextSite.target ?? fieldValues
            .find(({fieldLabelValueMap}) => fieldLabelValueMap.label === nextSite.fieldLabel)
            .fieldLabelValueMap.targetValues
            .find(({site}) => site === nextSite.siteName).value 
          }
      : nextSite

      return currentSite;
    }, {}))
  )

