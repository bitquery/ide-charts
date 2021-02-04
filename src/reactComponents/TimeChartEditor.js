import React, { useEffect, useState } from 'react'
import { useFirstUpdate } from '../util/useFirstUpdate'
import WidgetOptions from './WidgetOptions'

function TimeChartEditor({ model, config, setConfig, displayedData }) {
  const chartTypeModel = {
    Bar: 'bar',
    Line: 'line',
    Scatter: 'scatter',
    'Stacked Bar': 'stackedBar',
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

  const subgroupFunc = (key) => {
    if (model[key].typeInfo) {
      return (
        model[key].typeInfo.toString().includes('String') &&
        !model[key].name.value.includes('date') &&
        !model[key].name.value.includes('time')
      )
    }
  }
  const [subgroup, setSubgroup] = useState('')

  useEffect(() => {
    if (!yAxis && config) {
      if (Object.keys(config).length) {
        if ('y' in config) {
          setYAxis(`${displayedData}.${config.y.field}`)
        }
        if ('subgroupField' in config) {
          setSubgroup(`${displayedData}.${config.subgroupField}`)
        }
        setChartType('bar')
      }
    }
  }, [])

  useFirstUpdate(() => {
    if (model && yAxis) {
      let fieldY = yAxis.replace(`${displayedData}.`, '')
      let subgroupField
      if (subgroup) {
        subgroupField = subgroup.replace(`${displayedData}.`, '')
      } else {
        subgroupField = ''
      }
      let cfg = {
        chartType: chartType,
        y: { field: fieldY },
        subgroupField,
      }
      setConfig(cfg)
    }
  }, [chartType, yAxis, subgroup, displayedData])

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
        <WidgetOptions
          value={subgroup}
          setValue={setSubgroup}
          condition={subgroupFunc}
          title={'Subgroup'}
          model={model}
        />
      </div>
    </div>
  )
}

export default TimeChartEditor
