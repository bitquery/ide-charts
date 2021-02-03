import * as d3 from 'd3'
import * as _ from 'lodash'
import getPathToDate from './util/getPathToDate'
import formatLabel from './util/formatLabel'
import formatNumber from './util/formatNumber'
import './style.scss'

export function timeChart(selector, dataSource, displayedData, options) {
  dataSource = _.cloneDeep(dataSource)
  const queryVariables = JSON.parse(dataSource.variables)
  // options = {
  // 	field: 'count',
  // }

  const margin = { top: 10, right: 30, bottom: 30, left: 70 },
    width =
      d3.select(selector).node().getBoundingClientRect().width -
      margin.left -
      margin.right,
    height =
      d3.select(selector).node().getBoundingClientRect().height -
      margin.top -
      margin.bottom

  const data = dataSource.values

  const pathToDate = getPathToDate(data[0], queryVariables.dateFormat)
  const pathToYField = options.yField
  const yFieldName = formatLabel(pathToYField)

  console.log(pathToYField)
  data.forEach((d) => {
    d.date = d3.timeParse(queryVariables.dateFormat)(_.get(d, pathToDate))
  })

  d3.select(selector).html('')

  switch (options.chart) {
    case 'bar':
      bar()
      break

    case 'line':
      line()
      break

    case 'scatter':
      scatter()
      break

    case 'stackedBar':
      stackedBar()
      break

    default:
      break
  }

  function bar() {
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
    svg.append('g').attr('class', 'brush').call(brush)

    let bars = svg
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'bars')
    bars
      .selectAll('mybar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.date) - 2)
      .attr('width', 4)
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
        'translate(' + width / 2 + ' ,' + (height + margin.top + 15) + ')'
      )
      .style('text-anchor', 'middle')
      .style('font-size', '12')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .text('Time')
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text(yFieldName)

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
						<li>Date: ${d3.timeFormat(queryVariables.dateFormat)(d.date)}</li>
						<li>${yFieldName}: ${formatNumber(_.get(d, pathToYField))}</li>
					</ul>`
			)
			
			const bodyWidth = d3
        .select('body')
        .style('width')
        .slice(0, -2)
      const tooltipheight = e.pageY - tooltip.style('height').slice(0, -2) - 10
      const tooltipWidth = tooltip.style('width').slice(0, -2)
      const tooltipX =
        e.pageX < tooltipWidth / 2
          ? 0
          : e.pageX + tooltipWidth / 2 > bodyWidth
          ? bodyWidth - tooltipWidth
          : e.pageX - tooltipWidth / 2

      tooltip.style('top', tooltipheight + 'px').style('left', tooltipX + 'px')
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
          return y(_.get(d, pathToYField))
        })
    }

    svg.on('dblclick', function () {
      x.domain(
        d3.extent(data, function (d) {
          return d.date
        })
      ).nice(d3.timeMonth.every(2))

      xAxisGrid.transition().call(xAxis)

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
          return y(_.get(d, pathToYField))
        })
    })
  }

  function line() {
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
        'translate(' + width / 2 + ' ,' + (height + margin.top + 15) + ')'
      )
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text('Time')
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text(yFieldName)

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none')

    var bisectDate = d3.bisector(function (d) {
      return d.date
    }).left

    var focus = svg.append('g').attr('class', 'focus').style('display', 'none')

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
        .style('left', d3.select(selector).node().getBoundingClientRect().x + x(d.date) + 10 + 'px')
        .style('top', d3.select(selector).node().getBoundingClientRect().y + y(_.get(d, pathToYField)) - tooltipheight - 5 + 'px')
      tooltip.html(
        `<ul>
					<li>Date: ${d3.timeFormat(queryVariables.dateFormat)(d.date)}</li>
					<li>${yFieldName}: ${formatNumber(_.get(d, pathToYField))}</li>
				</ul>`
      )
    }

    function updateChart(event) {
      // mouseout()

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
      // setTimeout(() => {
      //   mouseover()
      //   mousemove(event)
      // }, 1000)
    }

    svg.on('dblclick', function () {
      // mouseout()
      x.domain(
        d3.extent(data, function (d) {
          return d.date
        })
      ).nice(d3.timeMonth.every(2))

      xAxisGrid.transition().call(xAxis)

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

      // setTimeout(() => {
      // 	mouseover()
      // 	mousemove(event)
      // }, 1000)
    })
  }

  function scatter() {
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
        'translate(' + width / 2 + ' ,' + (height + margin.top + 15) + ')'
      )
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text('Time')
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text(yFieldName)

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
						<li>Date: ${d3.timeFormat(queryVariables.dateFormat)(d.date)}</li>
						<li>${yFieldName}: ${formatNumber(_.get(d, pathToYField))}</li>
					</ul>`
      )

      const bodyWidth = d3
        .select('body')
        .style('width')
        .slice(0, -2)
      const tooltipheight = e.pageY - tooltip.style('height').slice(0, -2) - 10
      const tooltipWidth = tooltip.style('width').slice(0, -2)
      const tooltipX =
        e.pageX < tooltipWidth / 2
          ? 0
          : e.pageX + tooltipWidth / 2 > bodyWidth
          ? bodyWidth - tooltipWidth
          : e.pageX - tooltipWidth / 2

      tooltip.style('top', tooltipheight + 'px').style('left', tooltipX + 'px')
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
      ).nice(d3.timeMonth.every(2))

      xAxisGrid.transition().call(xAxis)

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
    const subgroups = _.uniq(data.map((d) => d.exchange.fullName))
    console.log(subgroups)

    const wide = Array.from(d3.group(data, (d) => d.date)).map((d) => {
      const newVal = {
        date: d[0],
        queryFields: d[1][0],
      }
      d[1].forEach((d) => {
        Object.assign(newVal, {
          [d.exchange.fullName]: d.count,
        })
      })
      subgroups.forEach((name) => {
        if (!(name in newVal)) {
          Object.assign(newVal, { [name]: 0 })
        }
      })

      return newVal
    })
    console.log(wide)

    const groups = wide.map((d) => d.date)
    console.log(groups)

    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const stackedData = d3.stack().keys(subgroups)(wide)
    console.log(stackedData)

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
      .select(selector)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const x = d3
      .scaleTime()
      .domain(d3.extent(groups))
      .range([0, width])
      .nice(d3.timeMonth.every(2))
    const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]).nice()

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
      .selectAll('mybar')
      .data((d) => d)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.data.date))
      .attr('width', 4)
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
        'translate(' + width / 2 + ' ,' + (height + margin.top + 15) + ')'
      )
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text('Time')
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .attr('font-family', 'Nunito, Arial, sans-serif')
      .style('font-size', '12')
      .text('Count')

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
						<li>Date: ${d3.timeFormat(queryVariables.dateFormat)(
              d.data.queryFields.date
            )}</li>
						<li>Name: ${d.data.queryFields.exchange.fullName}</li>
						<li>Count: ${d[1] - d[0]}</li>
						<li>Amount: ${d.data.queryFields.tradeAmount}</li>
					</ul>`
      )

      const bodyWidth = d3
        .select('body')
        .style('width')
        .slice(0, -2)
      const tooltipheight = e.pageY - tooltip.style('height').slice(0, -2) - 10
      const tooltipWidth = tooltip.style('width').slice(0, -2)
      const tooltipX =
        e.pageX < tooltipWidth / 2
          ? 0
          : e.pageX + tooltipWidth / 2 > bodyWidth
          ? bodyWidth - tooltipWidth
          : e.pageX - tooltipWidth / 2

      tooltip.style('top', tooltipheight + 'px').style('left', tooltipX + 'px')
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

      bars
        .selectAll('.bar')
        .transition()
        .duration(1000)
        .attr('x', (d) => x(d.data.date))
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => y(d[0]) - y(d[1]))
    }

    svg.on('dblclick', function () {
      x.domain(
        d3.extent(data, function (d) {
          return d.date
        })
      ).nice(d3.timeMonth.every(2))

      xAxisGrid.transition().call(xAxis)

      bars
        .selectAll('.bar')
        .transition()
        .attr('x', (d) => x(d.data.date))
        .attr('y', (d) => y(d[1]))
        .attr('height', (d) => y(d[0]) - y(d[1]))
    })
  }

  // bar()
  // line()
  // scatter()
  // stackedBar()
}
