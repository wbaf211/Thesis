import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DLineChart = ({ data, xAxisData }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current || !data.length || !xAxisData.length) return;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current);
    const margin = { top: 20, right: 50, bottom: 20, left: 50 };
    const width = 750 - margin.left - margin.right;
    const height = 390 - margin.top - margin.bottom;

    const xAxisDataSubset = xAxisData.slice(-8);

    const xScale = d3.scalePoint()
      .domain(xAxisDataSubset)
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const line = d3.line()
      .x((_, index) => xScale(xAxisDataSubset[index]))
      .y(d => yScale(d));

    const colorScale = d3.scaleOrdinal()
      .range(["darkorange", "gray", "navy", "red", "yellow"]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const legends = g.append('g')
      .attr('class', 'legends')
      .attr('transform', `translate(${width + 20}, 0)`);

    data.forEach((datum, i) => {
      const lineGroup = g.append('g')
        .attr('class', 'line-group');

      lineGroup.append('path')
        .data([datum.values])
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', colorScale(i))
        .attr('opacity', 0.5);

      lineGroup.selectAll('.dot')
        .data(datum.values)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', (_, index) => xScale(xAxisDataSubset[index]))
        .attr('cy', value => yScale(value))
        .attr('r', 4)
        .style('fill', colorScale(i))
        .attr('opacity', 0.5)
        .on('mouseover', function (event, value, index) {
          d3.select(this).attr('opacity', 1);
          lineGroup.select('path').attr('opacity', 1);

          const tooltipText = `Value: ${value}`;
          const tooltip = lineGroup.append('text')
            .attr('class', 'tooltip')
            .attr('x', (_, index) => xScale(xAxisDataSubset[index]))
            .attr('y', yScale(value) - 10)
            .text(tooltipText)
            .attr('text-anchor', 'middle');
        })
        .on('mouseout', function () {
          lineGroup.select('.tooltip').remove();
          d3.select(this).attr('opacity', 0.5);
          lineGroup.select('path').attr('opacity', 0.5);
        });

      const legend = legends.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(0, ${i * 20})`);

      legend.append('rect')
        .attr('x', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', colorScale(i));

      legend.append('text')
        .attr('x', 25)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .text(`${datum.id}`);
    });

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(11).tickFormat(d3.format(".0f")));

  }, [data, xAxisData]);

  return (
    <svg ref={chartRef} width={860} height={400}></svg>
  );
};

export default DLineChart;
