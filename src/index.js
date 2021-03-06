import TimeChartEditor from './reactComponents/TimeChartEditor'
import timeChartRenderer from './reactComponents/timeChartRenderer'
import hasQuantativeAndDate from './util/hasQuantativeAndDate'

class TimeChartPlugin {
  constructor() {
    this.id = 'time.chart'
    this.name = 'Time Chart'
    this.editor = TimeChartEditor
    this.renderer = timeChartRenderer
    this.dependencies = ['https://cdn.jsdelivr.net/npm/@bitquery/ide-charts@2.0.1/dist/timeChartRenderer.js']
    this.rendererName = 'timeChartRenderer'
  }
  supportsModel(model) {
    for (let key in model) {
      if (
        model[key].typeInfo.toString()[0] === '[' &&
        model[key].typeInfo.toString().slice(-2, -1) !== '0'
      ) {
				return hasQuantativeAndDate(model[key])
      }
      return false
    }
  }
}

export let timeChartPlugins = [new TimeChartPlugin()]