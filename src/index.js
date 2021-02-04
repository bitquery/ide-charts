import TimeChartEditor from './reactComponents/TimeChartEditor'
import TimeChartRenderer from './reactComponents/TimeChartRenderer'
import hasQuantative from './util/hasQuantative'

class TimeChartPlugin {
  constructor() {
    this.id = 'time.chart'
    this.name = 'Time Chart'
    this.editor = TimeChartEditor
    this.renderer = TimeChartRenderer
  }
  supportsModel(model) {
    for (let key in model) {
      if (
        model[key].typeInfo.toString()[0] === '[' &&
        model[key].typeInfo.toString().slice(-2, -1) !== '0'
      ) {
				return hasQuantative(model[key])
      }
      return false
    }
  }
}

export let timeChartPlugins = [new TimeChartPlugin()]