import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GBarChart = ({ data, xAxisData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const width = 700;
    const height = 290;
    const margin = { top: 20, right: 150, bottom: 50, left: 40 };

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const groups = Array.from(new Set(data.map(d => d.group)));

    const colorScale = d3.scaleOrdinal()
      .domain(groups)
      .range(["darkorange", "gray", "navy", "red", "yellow"]);

    const xScale = d3.scaleBand()
      .domain(xAxisData.slice(-8))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    const barWidth = xScale.bandwidth() / groups.length;

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category) + barWidth * groups.indexOf(d.group))
      .attr('y', d => yScale(d.value))
      .attr('width', barWidth)
      .attr('height', d => height - yScale(d.value))
      .attr('fill', d => colorScale(d.group))
      .on('mouseover', (event, d) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX}px`;
        tooltip.style.top = `${event.pageY - 30}px`;
        tooltip.innerHTML = `<strong>ID:</strong> ${d.group}<br><strong>Average:</strong> ${Math.min(d.trueValue, 100)}`;
        
        d3.selectAll('.legendRow').attr('opacity', 0.7);
        d3.selectAll(`.legendRow-${d.group}`).attr('opacity', 1);
        
        d3.select(event.target).attr('opacity', 1);
      })
      .on('mouseout', (event) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';

        d3.selectAll('.legendRow').attr('opacity', 0.7);
        d3.select(event.target).attr('opacity', 0.7);
      })
      .attr('opacity', 0.7);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickValues(xAxisData.slice(-8)));

    svg.append('g')
      .call(d3.axisLeft(yScale));

    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 0)`);

    groups.forEach((group, i) => {
      const legendRow = legend.append('g')
        .attr('class', `legendRow legendRow-${group}`)
        .attr('transform', `translate(0, ${i * 20})`)
        .attr('opacity', 0.7);

      legendRow.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colorScale(group));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 0)
        .attr('dy', '0.75em')
        .text(group);
    });

  }, [data, xAxisData]);

  return (
    <div>
      <div id="tooltip" style={{ display: 'none', position: 'absolute', backgroundColor: 'white', padding: '5px', border: '1px solid black' }}></div>
      <div ref={chartRef}></div>
    </div>
  );
};

export default GBarChart;
