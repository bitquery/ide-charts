import * as d3 from 'd3'
import * as _ from 'lodash'
import { getPathToDate } from './util/getPathToDate'
import './style.scss'

export function timeChart(selector, dataSource, displayedData, options) {
  const queryVariables = JSON.parse(dataSource.variables)
  // options = {
  // 	fields: ['count', 'count2']
  // }

  const margin = { top: 10, right: 30, bottom: 30, left: 70 },
    width = 450 - margin.left - margin.right,
    height = 390 - margin.top - margin.bottom

  const data = dataSource.values

  const pathToDate = getPathToDate(data[0], queryVariables.dateFormat)

  data.forEach((d) => {
    d.date = d3.timeParse(queryVariables.dateFormat)(_.get(d, pathToDate))
  })

  let svg = d3
    .select(selector)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.date
      })
    )
    .range([0, width])
    .nice(d3.timeMonth.every(2))
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d.count
      }),
    ])
    .range([height, 0])
    .nice()

  const xAxis = d3
    .axisBottom(x)
    .tickSize(-height)
    .ticks(5)
    .tickFormat((date) => {
      const n = x.ticks().length
      return n <=
        d3.timeFormat('%Y')(d3.max(x.ticks())) -
          d3.timeFormat('%Y')(d3.min(x.ticks())) +
          1
        ? d3.timeFormat('%Y')(date)
        : d3.timeFormat('%m/%y')(date)
    })
  const yAxis = d3.axisLeft(y).tickSize(-width)

  const xAxisGrid = svg
    .append('g')
    .call(xAxis)
    .attr('transform', 'translate(0,' + height + ')')
  const yAxisGrid = svg.append('g').call(yAxis)
  yAxisGrid.selectAll('line').attr('class', 'y-axis-grid')

  var clip = svg
    .append('defs')
    .append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)

  var brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height],
    ])
    .on('end', updateChart)

  // BARS //
  let bars = svg
    .append('g')
    .attr('clip-path', 'url(#clip)')
    .attr('class', 'bars')
  bars
    .selectAll('mybar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return x(d.date) - 2
    })
    .attr('width', function (d) {
      return 4
    })
    .attr('y', function (d) {
      return y(d.count)
    })
    .attr('height', function (d) {
      return height - y(d.count)
    })
    .attr('class', 'bar')
    .attr('fill', '#28a745')
  bars.append('g').attr('class', 'brush').call(brush)

  // LINE //
  // let line = svg.append('g').attr('clip-path', 'url(#clip)')
  // line
  //   .append('path')
  //   .datum(data)
  //   .attr('class', 'line')
  //   .attr('fill', 'none')
  //   .attr('stroke', '#28a745')
  //   .attr('stroke-width', 1.5)
  //   .attr(
  //     'd',
  //     d3
  //       .line()
  //       .x(function (d) {
  //         return x(d.date)
  //       })
  //       .y(function (d) {
  //         return y(d.count)
  //       })
  //   )
  // line.append('g').attr('class', 'brush').call(brush)

  // SCATTER //
  // let circles = svg
  //   .append('g')
  //   .attr('clip-path', 'url(#clip)')
  //   .attr('class', 'circles')
  // circles
  //   .selectAll('circle')
  //   .data(data)
  //   .enter()
  //   .append('circle')
  //   .attr('cx', function (d) {
  //     return x(d.date)
  //   })
  //   .attr('cy', function (d) {
  //     return y(d.count)
  //   })
  //   .attr('r', function (d) {
  //     return 4
  //   })
  //   .attr('class', 'circle')
  //   .attr('fill', '#28a745')
  // circles.append('g').attr('class', 'brush').call(brush)

  function updateChart(event) {
    const extent = event.selection

    var idleTimeout
    function idled() {
      idleTimeout = null
    }

    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
      x.domain([4, 8])
    } else {
      // BARS //
      bars.select('.brush').call(brush.move, null)
      // LINE //
      // line.select('.brush').call(brush.move, null)
      // SCATTER //
      // circles.select('.brush').call(brush.move, null)
      if (
        d3
          .scaleTime()
          .domain([x.invert(extent[0]), x.invert(extent[1])])
          .ticks(d3.timeMonth.every(1)).length < 5
      ) {
        return
      }
      x.domain([x.invert(extent[0]), x.invert(extent[1])])
    }
    xAxisGrid.transition().duration(1000).call(xAxis)

    // BARS //
    bars
      .selectAll('.bar')
      .transition()
      .duration(1000)
      .attr('x', function (d) {
        return x(d.date) - 2
      })
      .attr('width', function (d) {
        return 4
      })
      .attr('y', function (d) {
        return y(d.count)
      })
    // LINE //
    // line
    //   .select('.line')
    //   .transition()
    //   .duration(1000)
    //   .attr(
    //     'd',
    //     d3
    //       .line()
    //       .x(function (d) {
    //         return x(d.date)
    //       })
    //       .y(function (d) {
    //         return y(d.count)
    //       })
    //   )
    // SCATTER //
    // circles
    //   .selectAll('.circle')
    //   .transition()
    //   .duration(1000)
    //   .attr('cx', function (d) {
    //     return x(d.date)
    //   })
    //   .attr('cy', function (d) {
    //     return y(d.count)
    //   })
    //   .attr('r', function (d) {
    //     return 4
    //   })
  }

  svg.on('dblclick', function () {
    x.domain(
      d3.extent(data, function (d) {
        return d.date
      })
    ).nice(d3.timeMonth.every(2))

    xAxisGrid.transition().call(xAxis)

    // BARS //
    bars
      .selectAll('.bar')
      .transition()
      .attr('x', function (d) {
        return x(d.date) - 2
      })
      .attr('width', function (d) {
        return 4
      })
      .attr('y', function (d) {
        return y(d.count)
      })
    // Line //
    // line
    //   .select('.line')
    //   .transition()
    //   .attr(
    //     'd',
    //     d3
    //       .line()
    //       .x(function (d) {
    //         return x(d.date)
    //       })
    //       .y(function (d) {
    //         return y(d.count)
    //       })
    //   )
    // SCATTER //
    // circles
    //   .selectAll('.circle')
    //   .transition()
    //   .attr('cx', function (d) {
    //     return x(d.date)
    //   })
    //   .attr('cy', function (d) {
    //     return y(d.count)
    //   })
    //   .attr('r', function (d) {
    //     return 4
    //   })
  })
}
