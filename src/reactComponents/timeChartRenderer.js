import * as d3 from 'd3'
import * as _ from 'lodash'
import moment from 'moment'
import formatNumber from '../util/formatNumber'
var elementResizeEvent = require('element-resize-event')

export default async function timeChartRenderer(dataSource, options, selector) {
  dataSource = _.cloneDeep(dataSource)

  let values = undefined
  if (!dataSource.values) {
    const data = await dataSource.fetcher()
    const json = await data.json()
    values = dataSource.setupData(json)
  } else {
    values = dataSource.values
  }
  const data = values

  if (Array.isArray(data)) {
    var cfg = {
      chartType: options.chartType,
      xField: options.x.field,
      yField: options.y.field,
      subgroupField: options.subgroupField,
    }
    var pathToDate = cfg.xField
    var pathToYField = cfg.yField

    data.forEach((d) => {
      d.date = new Date(moment(_.get(d, pathToDate)))
      _.set(d, pathToYField, Number(_.get(d, pathToYField)))
    })

    var dt = {
      ms:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length),
      s:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        1000,
      min:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        (1000 * 60),
      h:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        (1000 * 60 * 60),
      d:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        (1000 * 60 * 60 * 24),
      m:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        (1000 * 60 * 60 * 24 * 30),
      y:
        (data[data.length - 1].date - data[0].date) /
        (data.length > 2 ? data.length - 2 : data.length) /
        (1000 * 60 * 60 * 24 * 365),
    }

    var tickByNumber =
      dt.s < 1
        ? 0
        : dt.min < 1
        ? 1
        : dt.hour < 1
        ? 2
        : dt.d < 1
        ? 3
        : dt.m < 1
        ? 4
        : dt.y < 1
        ? 5
        : 6

    var tickBy = [
      d3.timeMillisecond,
      d3.timeSecond,
      d3.timeMinute,
      d3.timeHour,
      d3.timeDay,
      d3.timeMonth,
      d3.timeYear,
    ]
  }

  const element = document.getElementById(selector).parentNode

  elementResizeEvent(element, function () {
    redraw()
  })

  redraw()

  function redraw() {
    const div = d3.select(`#${selector}`)

    const margin = { top: 10, right: 50, bottom: 40, left: 100 },
      width =
        div.node().getBoundingClientRect().width - margin.left - margin.right,
      height =
        div.node().getBoundingClientRect().height - margin.top - margin.bottom

    div.html('')

    switch (cfg.chartType) {
      case 'Bar':
        bar()
        break

      case 'Line':
        line()
        break

      case 'Scatter':
        scatter()
        break

      case 'Stacked Bar':
        stackedBar()
        break

      default:
        break
    }

    function bar() {
      let svg = d3
        .select(`#${selector}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      const x = d3
        .scaleBand()
        .domain(
          data.map(function (d) {
            return d.date
          })
        )
        .range([0, width])
        .paddingInner(0.1)

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return _.get(d, pathToYField)
          }),
        ])
        .range([height, 0])
        .nice()
      const xAxis = d3
        .axisBottom(x)
        .tickSize(-height)
        .tickValues(
          data
            .map((d, i) =>
              i % (Math.round(data.length / 5) + 1) == 0 ? d.date : null
            )
            .filter((d) => !!d)
        )
        .tickFormat((date) => {
          return tickByNumber == 6
            ? d3.timeFormat('%Y')(date)
            : tickByNumber == 5
            ? d3.timeFormat('%m/%y')(date)
            : tickByNumber == 4
            ? d3.timeFormat('%d/%m/%y')(date)
            : tickByNumber == 3
            ? d3.timeFormat('%H %d%/%m/%y')(date)
            : tickByNumber == 2
            ? d3.timeFormat('%H:%M %d%/%m/%y')(date)
            : d3.timeFormat('%H:%M:%S %d%/%m/%y')(date)
        })
      const yAxis = d3.axisLeft(y).tickSize(-width)

      const xAxisGrid = svg
        .append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
      xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
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
      svg.append('g').attr('class', 'brush').call(brush)

      let bars = svg
        .append('g')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'bars')
      bars
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.date))
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(_.get(d, pathToYField)))
        .attr('height', (d) => height - y(_.get(d, pathToYField)))
        .attr('class', 'bar')
        .attr('fill', '#28a745')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)

      svg
        .append('text')
        .attr(
          'transform',
          'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')'
        )
        .style('text-anchor', 'middle')
        .style('font-size', '12')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .text(pathToDate)
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToYField)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
      function mouseover() {
        d3.select(this).attr('stroke', 'black').attr('stroke-width', 0.6)
        tooltip.style('display', null).style('visibility', 'visible')
      }
      function mousemove(e, d) {
        tooltip.html(
          `<ul>
							<li>Date: ${
                tickByNumber == 6
                  ? d3.timeFormat('%Y')(d.date)
                  : tickByNumber == 5
                  ? d3.timeFormat('%m/%y')(d.date)
                  : tickByNumber == 4
                  ? d3.timeFormat('%d/%m/%y')(d.date)
                  : tickByNumber == 3
                  ? d3.timeFormat('%H %d%/%m/%y')(d.date)
                  : tickByNumber == 2
                  ? d3.timeFormat('%H:%M %d%/%m/%y')(d.date)
                  : d3.timeFormat('%H:%M:%S %d%/%m/%y')(d.date)
              }</li>
							<li>${pathToYField}: ${formatNumber(_.get(d, pathToYField))}</li>
						</ul>`
        )

        const bodyWidth = d3.select('body').style('width').slice(0, -2)
        const tooltipheight =
          e.pageY - tooltip.style('height').slice(0, -2) - 10
        const tooltipWidth = tooltip.style('width').slice(0, -2)
        const tooltipX =
          e.pageX < tooltipWidth / 2
            ? 0
            : e.pageX + tooltipWidth / 2 > bodyWidth
            ? bodyWidth - tooltipWidth
            : e.pageX - tooltipWidth / 2

        tooltip
          .style('top', tooltipheight + 'px')
          .style('left', tooltipX + 'px')
      }
      function mouseout() {
        tooltip.style('display', 'none').style('visibility', null)
        d3.select(this).attr('stroke', 'none')
      }

      function updateChart(event) {
        const extent = event.selection

        var idleTimeout
        function idled() {
          idleTimeout = null
        }

        let newData

        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
          x.domain([4, 8])
        } else {
          svg.select('.brush').call(brush.move, null)

          newData = data
            .map((d, i) => {
              const pos = x(d.date)
              if (pos > extent[0] && pos < extent[1]) {
                return d
              } else {
                return null
              }
            })
            .filter((d) => !!d)
          x.domain(newData.map((d) => d.date))
        }

        y.domain([
          0,
          d3.max(newData, function (d) {
            return _.get(d, pathToYField)
          }),
        ]).nice()

        xAxis.tickValues(
          newData
            .map((d, i) =>
              i % (Math.round(newData.length / 5) + 1) == 0 ||
              i == newData.length - 1
                ? d.date
                : null
            )
            .filter((d) => !!d)
        )
        xAxisGrid.transition().duration(1000).call(xAxis)
        xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
        yAxisGrid.transition().duration(1000).call(yAxis)

        bars.selectAll('rect').style('display', function (d) {
          const max = d3.max(x.domain())
          const min = d3.min(x.domain())

          if (d.date >= min && d.date <= max) {
            return null
          } else {
            return 'none'
          }
        })
        bars
          .selectAll('rect')
          .transition()
          .duration(1000)
          .attr('x', function (d) {
            return x(d.date)
          })
          .attr('width', function (d) {
            return x.bandwidth()
          })
          .attr('y', function (d) {
            return y(_.get(d, pathToYField))
          })
          .attr('height', (d) => height - y(_.get(d, pathToYField)))
      }

      svg.on('dblclick', function () {
        x.domain(
          data.map(function (d) {
            return d.date
          })
        )

        y.domain([
          0,
          d3.max(data, function (d) {
            return _.get(d, pathToYField)
          }),
        ]).nice()
        xAxis.tickValues(
          data
            .map((d, i) =>
              i % (Math.round(data.length / 5) + 1) == 0 || i == data.length - 1
                ? d.date
                : null
            )
            .filter((d) => !!d)
        )
        xAxisGrid.transition().call(xAxis)
        xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
        yAxisGrid.transition().call(yAxis)

        bars
          .selectAll('rect')
          .transition()
          .style('display', null)
          .attr('x', function (d) {
            return x(d.date)
          })
          .attr('width', function (d) {
            return x.bandwidth()
          })
          .attr('y', function (d) {
            return y(_.get(d, pathToYField))
          })
          .attr('height', (d) => height - y(_.get(d, pathToYField)))
      })
    }

    function line() {
      let svg = d3
        .select(`#${selector}`)
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
        .nice(tickBy[tickByNumber])
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return _.get(d, pathToYField)
          }),
        ])
        .range([height, 0])
        .nice()

      const xAxis = d3
        .axisBottom(x)
        .tickSize(-height)
        .ticks(5)
        .tickFormat((date) => {
          return tickByNumber == 6
            ? d3.timeFormat('%Y')(date)
            : tickByNumber == 5
            ? d3.timeFormat('%m/%y')(date)
            : tickByNumber == 4
            ? d3.timeFormat('%d/%m/%y')(date)
            : tickByNumber == 3
            ? d3.timeFormat('%H %d%/%m/%y')(date)
            : tickByNumber == 2
            ? d3.timeFormat('%H:%M %d%/%m/%y')(date)
            : d3.timeFormat('%H:%M:%S %d%/%m/%y')(date)
        })
      const yAxis = d3.axisLeft(y).tickSize(-width)

      const xAxisGrid = svg
        .append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
      xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
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
      svg.append('g').attr('class', 'brush').call(brush)

      let line = svg.append('g').attr('clip-path', 'url(#clip)')
      line
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#28a745')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.date)
            })
            .y(function (d) {
              return y(_.get(d, pathToYField))
            })
        )

      svg
        .append('text')
        .attr(
          'transform',
          'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')'
        )
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToDate)
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToYField)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')

      var bisectDate = d3.bisector(function (d) {
        return d.date
      }).left

      var focus = svg
        .append('g')
        .attr('class', 'focus')
        .style('display', 'none')

      focus.append('circle').attr('r', 3)

      svg
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove)
      function mouseover() {
        focus.style('display', null)
        tooltip.style('display', null).style('visibility', 'visible')
      }
      function mouseout() {
        focus.style('display', 'none')
        tooltip.style('display', 'none').style('visibility', null)
      }
      function mousemove(e) {
        var x0 = x.invert(d3.pointer(e)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i] || d0,
          d = x0 - d0.date > d1.date - x0 ? d1 : d0
        focus.attr(
          'transform',
          'translate(' + x(d.date) + ',' + y(_.get(d, pathToYField)) + ')'
        )
        const tooltipheight = tooltip.style('height').slice(0, -2)
        const tooltipWidth = tooltip.style('width').slice(0, -2)
        tooltip
          .style(
            'left',
            div.node().getBoundingClientRect().x + x(d.date) + 10 + 'px'
          )
          .style(
            'top',
            div.node().getBoundingClientRect().y +
              y(_.get(d, pathToYField)) -
              tooltipheight -
              5 +
              'px'
          )
        tooltip.html(
          `<ul>
						<li>Date: ${
              tickByNumber == 6
                ? d3.timeFormat('%Y')(d.date)
                : tickByNumber == 5
                ? d3.timeFormat('%m/%y')(d.date)
                : tickByNumber == 4
                ? d3.timeFormat('%d/%m/%y')(d.date)
                : tickByNumber == 3
                ? d3.timeFormat('%H %d%/%m/%y')(d.date)
                : tickByNumber == 2
                ? d3.timeFormat('%H:%M %d%/%m/%y')(d.date)
                : d3.timeFormat('%H:%M:%S %d%/%m/%y')(d.date)
            }</li>
						<li>${pathToYField}: ${formatNumber(_.get(d, pathToYField))}</li>
					</ul>`
        )
      }

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
          svg.select('.brush').call(brush.move, null)
          x.domain([x.invert(extent[0]), x.invert(extent[1])]).nice(
            tickBy[tickByNumber]
          )
        }
        y.domain([
          0,
          d3.max(
            data.map((d) => {
              const domain = x.domain()
              if (d.date >= domain[0] && d.date <= domain[1]) {
                return _.get(d, pathToYField)
              } else {
                return 0
              }
            })
          ),
        ]).nice()
        xAxisGrid.transition().duration(1000).call(xAxis)
        yAxisGrid.transition().duration(1000).call(yAxis)

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
                return y(_.get(d, pathToYField))
              })
          )
      }

      svg.on('dblclick', function () {
        x.domain(
          d3.extent(data, function (d) {
            return d.date
          })
        ).nice(tickBy[tickByNumber])

        y.domain([
          0,
          d3.max(
            data.map((d) => {
              const domain = x.domain()
              if (d.date >= domain[0] && d.date <= domain[1]) {
                return _.get(d, pathToYField)
              } else {
                return 0
              }
            })
          ),
        ]).nice()
        xAxisGrid.transition().call(xAxis)
        yAxisGrid.transition().call(yAxis)

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
                return y(_.get(d, pathToYField))
              })
          )
      })
    }

    function scatter() {
      let svg = d3
        .select(`#${selector}`)
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
        .nice(tickBy[tickByNumber])
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return _.get(d, pathToYField)
          }),
        ])
        .range([height, 0])
        .nice()

      const xAxis = d3
        .axisBottom(x)
        .tickSize(-height)
        .ticks(5)
        .tickFormat((date) => {
          return tickByNumber == 6
            ? d3.timeFormat('%Y')(date)
            : tickByNumber == 5
            ? d3.timeFormat('%m/%y')(date)
            : tickByNumber == 4
            ? d3.timeFormat('%d/%m/%y')(date)
            : tickByNumber == 3
            ? d3.timeFormat('%H %d%/%m/%y')(date)
            : tickByNumber == 2
            ? d3.timeFormat('%H:%M %d%/%m/%y')(date)
            : d3.timeFormat('%H:%M:%S %d%/%m/%y')(date)
        })
      const yAxis = d3.axisLeft(y).tickSize(-width)

      const xAxisGrid = svg
        .append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
      xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
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
      svg.append('g').attr('class', 'brush').call(brush)

      let circles = svg
        .append('g')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'circles')
      circles
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', function (d) {
          return x(d.date)
        })
        .attr('cy', function (d) {
          return y(_.get(d, pathToYField))
        })
        .attr('r', function (d) {
          return 4
        })
        .attr('class', 'circle')
        .attr('fill', '#28a745')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)

      svg
        .append('text')
        .attr(
          'transform',
          'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')'
        )
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToDate)
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToYField)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
      function mouseover() {
        d3.select(this).attr('stroke', 'black').attr('stroke-width', 0.6)
        tooltip.style('display', null).style('visibility', 'visible')
      }
      function mousemove(e, d) {
        tooltip.html(
          `<ul>
						<li>Date: ${
              tickByNumber == 6
                ? d3.timeFormat('%Y')(d.date)
                : tickByNumber == 5
                ? d3.timeFormat('%m/%y')(d.date)
                : tickByNumber == 4
                ? d3.timeFormat('%d/%m/%y')(d.date)
                : tickByNumber == 3
                ? d3.timeFormat('%H %d%/%m/%y')(d.date)
                : tickByNumber == 2
                ? d3.timeFormat('%H:%M %d%/%m/%y')(d.date)
                : d3.timeFormat('%H:%M:%S %d%/%m/%y')(d.date)
            }</li>
							<li>${pathToYField}: ${formatNumber(_.get(d, pathToYField))}</li>
						</ul>`
        )

        const bodyWidth = d3.select('body').style('width').slice(0, -2)
        const tooltipheight =
          e.pageY - tooltip.style('height').slice(0, -2) - 10
        const tooltipWidth = tooltip.style('width').slice(0, -2)
        const tooltipX =
          e.pageX < tooltipWidth / 2
            ? 0
            : e.pageX + tooltipWidth / 2 > bodyWidth
            ? bodyWidth - tooltipWidth
            : e.pageX - tooltipWidth / 2

        tooltip
          .style('top', tooltipheight + 'px')
          .style('left', tooltipX + 'px')
      }
      function mouseout() {
        tooltip.style('display', 'none').style('visibility', null)
        d3.select(this).attr('stroke', 'none')
      }

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
          svg.select('.brush').call(brush.move, null)
          x.domain([x.invert(extent[0]), x.invert(extent[1])]).nice(
            tickBy[tickByNumber]
          )
        }
        y.domain([
          0,
          d3.max(
            data.map((d) => {
              const domain = x.domain()
              if (d.date >= domain[0] && d.date <= domain[1]) {
                return _.get(d, pathToYField)
              } else {
                return 0
              }
            })
          ),
        ]).nice()
        xAxisGrid.transition().duration(1000).call(xAxis)
        yAxisGrid.transition().duration(1000).call(yAxis)

        circles
          .selectAll('.circle')
          .transition()
          .duration(1000)
          .attr('cx', function (d) {
            return x(d.date)
          })
          .attr('cy', function (d) {
            return y(_.get(d, pathToYField))
          })
          .attr('r', function (d) {
            return 4
          })
      }

      svg.on('dblclick', function () {
        x.domain(
          d3.extent(data, function (d) {
            return d.date
          })
        ).nice(tickBy[tickByNumber])

        y.domain([
          0,
          d3.max(
            data.map((d) => {
              const domain = x.domain()
              if (d.date >= domain[0] && d.date <= domain[1]) {
                return _.get(d, pathToYField)
              } else {
                return 0
              }
            })
          ),
        ]).nice()
        xAxisGrid.transition().call(xAxis)
        yAxisGrid.transition().call(yAxis)

        circles
          .selectAll('.circle')
          .transition()
          .attr('cx', function (d) {
            return x(d.date)
          })
          .attr('cy', function (d) {
            return y(_.get(d, pathToYField))
          })
          .attr('r', function (d) {
            return 4
          })
      })
    }

    function stackedBar() {
      const pathToSubgroupField = cfg.subgroupField
      const subgroups = _.uniq(data.map((d) => _.get(d, pathToSubgroupField)))

      const wide = Array.from(d3.group(data, (d) => d.date)).map((d) => {
        const newVal = {
          date: d[0],
        }
        d[1].forEach((d) => {
          Object.assign(newVal, {
            [_.get(d, pathToSubgroupField)]: _.get(d, pathToYField),
          })
        })
        subgroups.forEach((name) => {
          if (!(name in newVal)) {
            Object.assign(newVal, { [name]: 0 })
          }
        })

        return newVal
      })

      dt = {
        ms:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length),
        s:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          1000,
        min:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          (1000 * 60),
        h:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          (1000 * 60 * 60),
        d:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          (1000 * 60 * 60 * 24),
        m:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          (1000 * 60 * 60 * 24 * 30),
        y:
          (wide[wide.length - 1].date - wide[0].date) /
          (wide.length > 2 ? wide.length - 2 : wide.length) /
          (1000 * 60 * 60 * 24 * 365),
      }

      tickByNumber =
        dt.s < 1
          ? 0
          : dt.min < 1
          ? 1
          : dt.hour < 1
          ? 2
          : dt.d < 1
          ? 3
          : dt.m < 1
          ? 4
          : dt.y < 1
          ? 5
          : 6

      const groups = wide.map((d) => d.date)

      const color = d3.scaleOrdinal(d3.schemeCategory10)

      const stackedData = d3.stack().keys(subgroups)(wide)

      stackedData.forEach((layer) => {
        layer.forEach((a) => {
          a.key = layer.key
        })
      })

      const yMax = d3.max(
        wide.map((d) => {
          let acc = 0
          for (let k in d) {
            if (typeof d[k] !== 'object') {
              acc += d[k]
            }
          }
          return acc
        })
      )

      let svg = d3
        .select(`#${selector}`)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      const x = d3
        .scaleBand()
        .domain(
          wide.map(function (d) {
            return d.date
          })
        )
        .range([0, width])
        .paddingInner(0.1)

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(
            wide.map((d) => {
              let acc = 0
              for (let k in d) {
                if (typeof d[k] !== 'object') {
                  acc += d[k]
                }
              }
              return acc
            })
          ),
        ])
        .range([height, 0])
        .nice()

      const xAxis = d3
        .axisBottom(x)
        .tickSize(-height)
        .tickValues(
          wide
            .map((d, i) =>
              i % (Math.round(wide.length / 5) + 1) == 0 ? d.date : null
            )
            .filter((d) => !!d)
        )
        .tickFormat((date) => {
          return tickByNumber == 6
            ? d3.timeFormat('%Y')(date)
            : tickByNumber == 5
            ? d3.timeFormat('%m/%y')(date)
            : tickByNumber == 4
            ? d3.timeFormat('%d/%m/%y')(date)
            : tickByNumber == 3
            ? d3.timeFormat('%H %d%/%m/%y')(date)
            : tickByNumber == 2
            ? d3.timeFormat('%H:%M %d%/%m/%y')(date)
            : d3.timeFormat('%H:%M:%S %d%/%m/%y')(date)
        })
      const yAxis = d3.axisLeft(y).tickSize(-width)

      const xAxisGrid = svg
        .append('g')
        .call(xAxis)
        .attr('transform', 'translate(0,' + height + ')')
      xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
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
      svg.append('g').attr('class', 'brush').call(brush)

      let barsLayers = svg
        .append('g')
        .attr('clip-path', 'url(#clip)')
        .attr('class', 'bars')

      let bars = barsLayers
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', (d) => color(d.key))
      bars
        .selectAll('rect')
        .data((d) => d)
        .enter()
        .append('rect')
        .attr('x', (d) => x(d.data.date))
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => y(d[0]) - y(d[1]))
        .attr('class', 'bar')
        .attr('pointer-events', 'all')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)

      svg
        .append('text')
        .attr(
          'transform',
          'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')'
        )
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToDate)
      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .attr('font-family', 'Nunito, Arial, sans-serif')
        .style('font-size', '12')
        .text(pathToYField)

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('display', 'none')
      function mouseover() {
        d3.select(this).attr('stroke', 'black').attr('stroke-width', 0.6)
        tooltip.style('display', null).style('visibility', 'visible')
      }
      function mousemove(e, d) {
        tooltip.html(
          `<ul>
						<li>Date: ${
              tickByNumber == 6
                ? d3.timeFormat('%Y')(d.data.date)
                : tickByNumber == 5
                ? d3.timeFormat('%m/%y')(d.data.date)
                : tickByNumber == 4
                ? d3.timeFormat('%d/%m/%y')(d.data.date)
                : tickByNumber == 3
                ? d3.timeFormat('%H %d%/%m/%y')(d.data.date)
                : tickByNumber == 2
                ? d3.timeFormat('%H:%M %d%/%m/%y')(d.data.date)
                : d3.timeFormat('%H:%M:%S %d%/%m/%y')(d.data.date)
            }</li>
							${
                d.key
                  ? `<li>Subgroup: ${
                      d.key && d.key.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    }</li>`
                  : ''
              }
							<li>${pathToYField}: ${formatNumber(d[1] - d[0])}</li>
						</ul>`
        )

        const bodyWidth = d3.select('body').style('width').slice(0, -2)
        const tooltipheight =
          e.pageY - tooltip.style('height').slice(0, -2) - 10
        const tooltipWidth = tooltip.style('width').slice(0, -2)
        const tooltipX =
          e.pageX < tooltipWidth / 2
            ? 0
            : e.pageX + tooltipWidth / 2 > bodyWidth
            ? bodyWidth - tooltipWidth
            : e.pageX - tooltipWidth / 2

        tooltip
          .style('top', tooltipheight + 'px')
          .style('left', tooltipX + 'px')
      }
      function mouseout() {
        tooltip.style('display', 'none').style('visibility', null)
        d3.select(this).attr('stroke', 'none')
      }

      function updateChart(event) {
        const extent = event.selection

        var idleTimeout
        function idled() {
          idleTimeout = null
        }

        let newData

        if (!extent) {
          if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350))
          x.domain([4, 8])
        } else {
          svg.select('.brush').call(brush.move, null)

          newData = wide
            .map((d, i) => {
              const pos = x(d.date)
              if (pos > extent[0] && pos < extent[1]) {
                return d
              } else {
                return null
              }
            })
            .filter((d) => !!d)

          x.domain(newData.map((d) => d.date))
        }
        y.domain([
          0,
          d3.max(
            newData.map((d) => {
              let acc = 0
              for (let k in d) {
                if (typeof d[k] !== 'object') {
                  acc += d[k]
                }
              }
              return acc
            })
          ),
        ]).nice()

        xAxis.tickValues(
          newData
            .map((d, i) =>
              i % (Math.round(newData.length / 5) + 1) == 0 ||
              i == newData.length - 1
                ? d.date
                : null
            )
            .filter((d) => !!d)
        )
        xAxisGrid.transition().duration(1000).call(xAxis)
        xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
        yAxisGrid.transition().duration(1000).call(yAxis)

        bars.selectAll('rect').style('display', function (d) {
          const max = d3.max(x.domain())
          const min = d3.min(x.domain())
          if (d.data.date >= min && d.data.date <= max) {
            return null
          } else {
            return 'none'
          }
        })
        bars
          .selectAll('rect')
          .transition()
          .duration(1000)
          .attr('x', (d) => x(d.data.date))
          .attr('width', x.bandwidth())
          .attr('y', (d) => y(d[1]))
          .attr('height', (d) => y(d[0]) - y(d[1]))
      }

      svg.on('dblclick', function () {
        x.domain(
          wide.map(function (d) {
            return d.date
          })
        )

        y.domain([
          0,
          d3.max(
            wide.map((d) => {
              let acc = 0
              for (let k in d) {
                if (typeof d[k] !== 'object') {
                  acc += d[k]
                }
              }
              return acc
            })
          ),
        ]).nice()
        xAxis.tickValues(
          wide
            .map((d, i) =>
              i % (Math.round(wide.length / 5) + 1) == 0 ? d.date : null
            )
            .filter((d) => !!d)
        )
        xAxisGrid.transition().call(xAxis)
        xAxisGrid.selectAll('.tick text').attr('transform', 'translate(0, 5)')
        yAxisGrid.transition().call(yAxis)

        bars
          .selectAll('.bar')
          .transition()
          .style('display', null)
          .attr('x', (d) => x(d.data.date))
          .attr('width', x.bandwidth())
          .attr('y', (d) => y(d[1]))
          .attr('height', (d) => y(d[0]) - y(d[1]))
      })
    }
  }
}

window.timeChartRenderer = timeChartRenderer
