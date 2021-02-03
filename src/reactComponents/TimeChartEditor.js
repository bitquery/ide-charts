import React, { useEffect, useState } from 'react'
import { useFirstUpdate } from '../util/useFirstUpdate'
import WidgetOptions from './WidgetOptions'

function TimeChartEditor({ model, config, setConfig, displayedData }) {
	const chartTypeModel = {
		bar: 'bar',
		line: 'line',
		scatter: 'scatter',
		stackedBar: 'stackedBar'
	}
	const chartTypeFunc = () => true
	const [chartType, setChartType] = useState('')

  const yFunc = (key) => {
    if (model[key].typeInfo) {
      return (
        model[key].typeInfo.toString().includes('Int') ||
        model[key].typeInfo.toString().includes('Float')
      )
    }
  }
  const [yAxis, setYAxis] = useState('')

  useEffect(() => {
    if (!yAxis && config) {
      if (Object.keys(config).length) {
        if ('y' in config) {
					setYAxis(`${displayedData}.${config.y.field}`)
					setChartType('bar')
        }
      }
    }
  }, [])

  useFirstUpdate(() => {
    if (model && yAxis) {
      let fieldY = yAxis.replace(`${displayedData}.`, '')
      let cfg = {
				chartType: chartType,
        y: { field: fieldY },
      }
      setConfig(cfg)
    }
  }, [chartType, yAxis, displayedData])

  return (
    <div className="widget">
      <div className="widget-editor">
        <WidgetOptions
          value={chartType}
          setValue={setChartType}
          condition={chartTypeFunc}
          title={'Chart Type'}
          model={chartTypeModel}
        />
        <WidgetOptions
          value={yAxis}
          setValue={setYAxis}
          condition={yFunc}
          title={'Y Axis'}
          model={model}
        />
      </div>
    </div>
  )
}

export default TimeChartEditor
