import * as d3 from 'd3'
import { ticks } from 'd3'
import * as _ from 'lodash'
import moment from 'moment'
import { getPathToDate } from './util/getPathToDate'
import './style.scss'

export function timeChart(selector, dataSource, displayedData, options) {
  const queryVariables = JSON.parse(dataSource.variables)
  // options = {
  // 	fields: ['count', 'count2']
  // }

  var margin = { top: 10, right: 30, bottom: 90, left: 70 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom

  // var svg = d3
  //   .select(selector)
  //   .append('svg')
  //   .attr('width', width + margin.left + margin.right)
  //   .attr('height', height + margin.top + margin.bottom)
  //   .append('g')
  //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const data = dataSource.values

  const pathToDate = getPathToDate(data[0], queryVariables.dateFormat)

  data.forEach((d) => {
    d.date = d3.timeParse('%Y-%m')(_.get(d, pathToDate))
  })

  // const x = d3
  //   .scaleTime()
  //   .range([0, width])
  //   .domain([
  //     d3.min(data, function (d) {
  //       return d3.timeDay.offset(d.date, -20)
  //     }),
  //     d3.max(data, function (d) {
  //       return d3.timeDay.offset(d.date, 20)
  //     }),
  //   ])

  // const xAxis = (g) =>
  //   g
  //     // .append('g')
  //     .attr('transform', 'translate(0,' + height + ')')
  //     .call(
  //       d3.axisBottom(x)
  //       // .tickFormat(d3.timeFormat('%Y'))
  //       // .ticks(d3.timeYear.every(1))
  //     )
  //     .selectAll('text')
  //     .attr('transform', 'translate(-10,0)rotate(-45)')
  //     .style('text-anchor', 'end')

  // const y = d3
  //   .scaleLinear()
  //   .range([height, 0])
  //   .domain([0, d3.max(data.map((d) => d.count))])

  // const yAxis = (g) => g.call(d3.axisLeft(y))

  // const xAxisGrid = d3
  //   .axisBottom(x)
  //   .tickSize(height)
  //   .tickFormat('')
  //   .ticks(d3.timeYear.every(1))
  // const yAxisGrid = d3.axisLeft(y).tickSize(width).tickFormat('')

  // var svg = d3
  //   .select(selector)
  //   .append('svg')
  //   .attr('width', width + margin.left + margin.right)
  //   .attr('height', height + margin.top + margin.bottom)
  //   .call(zoom)
  //   .append('g')
  //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // svg
  //   .append('g')
  //   .attr('class', 'x axis-grid')
  //   .attr('opacity', 0.3)
  //   .call(xAxisGrid)
  // svg
  //   .append('g')
  //   .attr('class', 'y axis-grid')
  //   .attr('opacity', 0.3)
  //   .attr('transform', 'translate(' + width + ',0)')
  //   .call(yAxisGrid)

  // // Bars
  // svg
  //   .append('g')
  //   .attr('class', 'bars')
  //   .selectAll('mybar')
  //   .data(data)
  //   .enter()
  //   .append('rect')
  //   .attr('x', function (d) {
  //     return x(d3.timeDay.offset(d.date, -5))
  //   })
  //   .attr('width', function (d) {
  //     return x(d3.timeDay.offset(d.date, 10)) - x(d.date)
  //   })
  //   .attr('y', function (d) {
  //     return y(d.count)
  //   })
  //   .attr('height', function (d) {
  //     return height - y(d.count)
  //   })
  //   .attr('fill', '#28a745')

  // svg.append('g').attr('class', 'x-axis').call(xAxis)

  // svg.append('g').attr('class', 'y-axis').call(yAxis)

  // function zoom(svg) {
  //   const extent = [
  //     [margin.left, margin.top],
  //     [width - margin.right, height - margin.top],
  //   ]

  //   svg.call(
  //     d3
  //       .zoom()
  //       .scaleExtent([1, 8])
  //       .translateExtent(extent)
  //       .extent(extent)
  //       .on('zoom', zoomed)
  //   )

  //   function zoomed(event) {
  //     x.range(
  //       [margin.left, width - margin.right].map((d) =>
  //         event.transform.applyX(d)
  //       )
  //     )
  //     svg
  //       .selectAll('.bars rect')
  //       .attr('x', (d) => x(d.date))
  //       .attr('width', (d) => x(d3.timeDay.offset(d.date, 10)) - x(d.date))
  //     svg.selectAll('.x-axis').call(xAxis)
  //   }
  // }

  // Line
  // svg
  //   .append('path')
  //   .datum(data)
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

  var svg = d3
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
  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return +d.count
      }),
    ])
    .range([height, 0])

  const xAxis = d3.axisBottom(x).tickSize(-height)
  const yAxis = d3.axisLeft(y).tickSize(-width)

  const xAxisGrid = svg.append('g').call(xAxis).attr("transform", "translate(0,"+height+")")
  const yAxisGrid = svg.append('g').call(yAxis)

  // svg
  //   .append('g')
  //   .attr('class', 'x axis-grid')
  //   .attr('opacity', 0.3)
  //   .call(xAxisGrid)
  // svg
  //   .append('g')
  //   .attr('class', 'y axis-grid')
  //   .attr('opacity', 0.3)
  //   .attr('transform', 'translate(' + width + ',0)')
  //   .call(yAxisGrid)

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg
    .append('defs')
    .append('svg:clipPath')
    .attr('id', 'clip')
    .append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('x', 0)
    .attr('y', 0)

  // Add brushing
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [width, height],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on('end', updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the line variable: where both the line and the brush take place
  var line = svg.append('g').attr('clip-path', 'url(#clip)')

  // Add the line
  line
    .append('path')
    .datum(data)
    .attr('class', 'line') // I add the class line to be able to modify this line later on.
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .line()
        .x(function (d) {
          return x(d.date)
        })
        .y(function (d) {
          return y(d.count)
        })
    )

  // Add the brushing
  line.append('g').attr('class', 'brush').call(brush)

  // A function that set idleTimeOut to null
  var idleTimeout
  function idled() {
    idleTimeout = null
  }

  // A function that update the chart for given boundaries
  function updateChart(event) {
    // What are the selected boundaries?
    const extent = event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
      x.domain([4, 8])
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])])
      xAxisGrid.transition().duration(1000).call(xAxis)
      line.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and line position
    // xAxis.transition().duration(1000).call(d3.axisBottom(x))
    line
      .select('.line')
      .transition()
      .duration(1000)
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.date)
          })
          .y(function (d) {
            return y(d.count)
          })
      )
  }

  // If user double click, reinitialize the chart
  svg.on('dblclick', function () {
    x.domain(
      d3.extent(data, function (d) {
        return d.date
      })
    )
    xAxis.transition().call(d3.axisBottom(x))
    line
      .select('.line')
      .transition()
      .attr(
        'd',
        d3
          .line()
          .x(function (d) {
            return x(d.date)
          })
          .y(function (d) {
            return y(d.count)
          })
      )
  })
}
