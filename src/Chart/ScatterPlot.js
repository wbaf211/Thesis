import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ScatterPlotChart = ({ data, title }) => {
  const svgRef = useRef();

  useEffect(() => {
    const createScatterPlot = () => {
      const margin = { top: 10, right: 120, bottom: 30, left: 40 }; // Adjusted right margin
      const width = 820 - margin.left - margin.right;
      const height = 280 - margin.top - margin.bottom;

      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3
        .select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left - 5},${margin.top + 10})`);

      const xScale = d3.scaleLinear().domain([0, d3.max(data, (d) => d.x)]).range([0, width]);
      const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

      const tickValues = [80, 70, 60, 50];
      svg
        .selectAll('.grid-line')
        .data(tickValues)
        .enter()
        .append('line')
        .attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d));

      // Add labels to the right of the lines
      svg
        .selectAll('.tick-label')
        .data(tickValues)
        .enter()
        .append('text')
        .attr('class', 'tick-label')
        .attr('x', width + 10) // 10px to the right of the lines
        .attr('dy', (d) => {
          if (d === 80) return '25px'; // Move "Excellent" up
          if (d === 70) return '64px';  // Move "Good" to the middle
          if (d === 60) return '88px';  // Move "Average Good" to the middle
          if (d === 50) return '115px';  // Move "Average" to the middle
          return '';
        })
        .style('font-size', '12px') // Set font size to 12px
        .text((d) => {
          if (d === 80) return 'Excellent';
          if (d === 70) return 'Good';
          if (d === 60) return 'Average Good';
          if (d === 50) return 'Average';
          return '';
        });

      const circles = svg
        .selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.x))
        .attr('cy', (d) => yScale(d.y))
        .attr('r', 5)
        .on('mouseover', (event, d) => showTooltip(event, d))
        .on('mouseout', () => hideTooltip());

      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g').call(d3.axisLeft(yScale));

      function showTooltip(event, data) {
        const tooltip = svg.append('div').attr('class', 'tooltip');
        tooltip
          .html(`X: ${data.x}, Y: ${data.y}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      }

      function hideTooltip() {
        svg.selectAll('.tooltip').remove();
      }
    };

    createScatterPlot();
  }, [data]);

  return (
    <div style={{ height: '340px' }} className="scatter-plot container">
      <h1 style={{ marginLeft: '20px', marginTop: '10px' }}>Student's Classify Distribution Chart</h1>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default ScatterPlotChart;
