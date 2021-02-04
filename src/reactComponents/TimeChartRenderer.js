import React, { useEffect, useState } from 'react'
import { timeChart } from '../lib'

function TimeChartRenderer({ el, config, dataSource, displayedData }) {
  useEffect(() => {
    if (dataSource && config && displayedData && dataSource.data) {
      try {
        el &&
          timeChart(`#${el}`, dataSource, displayedData, {
						chart: config.chartType,
						yField: config.y.field,
						subgroupField: config.subgroupField
          })
      } catch (error) {
        console.log(error)
      }
    }
  }, [JSON.stringify(config), JSON.stringify(dataSource), displayedData])
  if (!dataSource) return <div></div>
  return (
    <div className="widget-display">
      <div style={{ width: '100%', overflowY: 'hidden' }} id={el} />
    </div>
  )
}

export default TimeChartRenderer
