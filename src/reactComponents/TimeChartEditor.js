import React, { useEffect, useState } from 'react'
import { useFirstUpdate } from '../util/useFirstUpdate'
import WidgetOptions from './WidgetOptions'

function TimeChartEditor({ model, config, setConfig, displayedData }) {
  const chartTypeModelFunc = () => {
    let hasSubgroup = false
    for (let key in model) {
      if (
        model[key].typeInfo.toString().includes('String') &&
        !model[key].name.value.includes('date') &&
        !model[key].name.value.includes('time')
      ) {
        hasSubgroup = true
      }
    }
    if (hasSubgroup) {
      return ['Stacked Bar']
    } else {
      return ['Bar', 'Line', 'Scatter']
		}
  }
  const [chartType, setChartType] = useState('')

  const xFunc = () => {
    const keys = Object.keys(model)
    const fields = []
    keys.forEach((key) => {
      if (
        model[key].typeInfo.name === 'Date' ||
        model[key].typeInfo.name === 'DateTime'
      ) {
        keys.forEach((k) => {
          if (k.includes(key) && k !== key) {
            fields.push(k)
          }
        })
      }
    })

    return fields
  }
  const [xAxis, setXAxis] = useState('')

  const yFunc = () => {
    const keys = Object.keys(model)
    const fields = []
    keys.forEach((key) => {
      if (
        model[key].typeInfo.toString().includes('Int') ||
        model[key].typeInfo.toString().includes('Float')
      ) {
        fields.push(key)
      }
		})
		return fields
  }
  const [yAxis, setYAxis] = useState('')

  const subgroupFunc = () => {
		const keys = Object.keys(model)
    const fields = []
    keys.forEach((key) => {
      if (
        model[key].typeInfo.toString().includes('String') &&
        !model[key].name.value.includes('date') &&
        !model[key].name.value.includes('time')
      ) {
        fields.push(key)
      }
		})
		return fields
  }
  const [subgroup, setSubgroup] = useState('')

  useEffect(() => {
    if (!xAxis && !yAxis && config) {
      if (Object.keys(config).length) {
        if ('x' in config) {
          setXAxis(`${displayedData}.${config.x.field}`)
        }
        if ('y' in config) {
          setYAxis(`${displayedData}.${config.y.field}`)
        }
        if ('chartType' in config) {
          setChartType(config.chartType)
        }
        if ('subgroupField' in config) {
          setSubgroup(`${displayedData}.${config.subgroupField}`)
        }
      }
    }
  }, [])

  useFirstUpdate(() => {
    if (model && xAxis && yAxis && chartType) {
      let fieldX = xAxis.replace(`${displayedData}.`, '')
      let fieldY = yAxis.replace(`${displayedData}.`, '')
      let subgroupField = subgroup && subgroup.replace(`${displayedData}.`, '')
      let cfg = {
        chartType: chartType,
        x: { field: fieldX },
        y: { field: fieldY },
        subgroupField,
			}
			
      setConfig(cfg)
    }
  }, [chartType, xAxis, yAxis, subgroup, displayedData])

  return (
    <div className="widget">
      <div className="widget-editor">
        <WidgetOptions
          value={chartType}
          setValue={setChartType}
          condition={chartTypeModelFunc}
          title={'Chart Type'}
          model={model}
        />
        <WidgetOptions
          value={xAxis}
          setValue={setXAxis}
          condition={xFunc}
          title={'X Axis'}
          model={model}
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
