import React, { useEffect, useState } from 'react'
import { useFirstUpdate } from '../util/useFirstUpdate'
import WidgetOptions from './WidgetOptions'

function TimeChartEditor({ model, config, setConfig, displayedData }) {
  const chartTypeModel = {
    Bar: 'Bar',
    Line: 'Line',
    Scatter: 'Scatter',
    'Stacked Bar': 'Stacked Bar',
  }
  const [chartType, setChartType] = useState('')

  const getDateModel = (model) => {
    const keys = Object.keys(model)
    const dateModel = {}
    const dateFields = []
    keys.forEach((key) => {
      if (
        model[key].typeInfo.name === 'Date' ||
        model[key].typeInfo.name === 'DateTime'
      ) {
        keys.forEach((k) => {
          if (k.includes(key) && k !== key) {
            dateFields.push(k)
          }
        })
      }
    })

    dateFields.forEach((keyVal) => (dateModel[keyVal] = keyVal))
    return dateModel
  }
  const dateModel = getDateModel(model)
  const [xAxis, setXAxis] = useState('')

  const yFunc = (key) => {
    if (model[key].typeInfo) {
      return (
        model[key].typeInfo.toString().includes('Int') ||
        model[key].typeInfo.toString().includes('Float')
      )
    }
  }
  const [yAxis, setYAxis] = useState('')

  // const hasSubgroups = (model) => {
  //   let has = false
  //   const keys = Object.keys(model)
  //   const dateKey = keys.find((key) => {
  //     if (model[key].typeInfo) {
  //       return model[key].typeInfo.name === 'Date'
  //     }
  //   })
  //   keys.forEach((key) => {
  //     if (!key.includes(dateKey)) {
  //       if (model[key].typeInfo) {
  //         if (model[key].typeInfo.toString().includes('String')) {
  //           has = true
  //         }
  //       }
  //     }
  //   })
  //   return has
  // }
  // const [showSubgroup, setShowSubgroup] = useState(hasSubgroups(model))

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

  // useEffect(() => {
  //   setShowSubgroup(hasSubgroups(model))
  // }, [model])

  useFirstUpdate(() => {
    // console.log(xAxis, yAxis, config)
    // setShowSubgroup(hasSubgroups(model))
    if (model && xAxis && yAxis) {
      let fieldX = xAxis.replace(`${displayedData}.`, '')
      let fieldY = yAxis.replace(`${displayedData}.`, '')
      let subgroupField = subgroup && subgroup.replace(`${displayedData}.`, '')
      let cfg = {
        chartType: chartType,
        x: { field: fieldX },
        y: { field: fieldY },
        subgroupField,
      }

      // if (showSubgroup) {
      //   let subgroupField = subgroup.replace(`${displayedData}.`, '')
      //   Object.assign(cfg, {
      //     subgroupField,
      //   })
      // }

      setConfig(cfg)
    }
  }, [chartType, xAxis, yAxis, subgroup, displayedData])

  return (
    <div className="widget">
      <div className="widget-editor">
        <WidgetOptions
          value={chartType}
          setValue={setChartType}
          condition={() => true}
          title={'Chart Type'}
          model={chartTypeModel}
        />
        <WidgetOptions
          value={xAxis}
          setValue={setXAxis}
          condition={() => true}
          title={'X Axis'}
          model={dateModel}
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
