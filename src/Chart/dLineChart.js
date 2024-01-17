import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DLineChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    const margin = { top: 20, right: 50, bottom: 20, left: 30 };
    const width = 600 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Thiết lập scale cho trục x và y với margin
    const xScale = d3.scaleLinear()
                      .domain([0, data.length - 1])
                      .range([0, width]);

    const yScale = d3.scaleLinear()
                      .domain([0, 100])
                      .range([height, 0]);

    // Tạo đường line
    const line = d3.line()
                    .x((d, i) => xScale(i))
                    .y(d => yScale(d));

    // Tạo container cho đồ thị với margin
    const g = svg.append('g')
                  .attr('transform', `translate(${margin.left},${margin.top})`);

    // Vẽ đường line trên biểu đồ
    g.append('path')
      .data([data])
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'blue');

    // Vẽ trục x và y
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(11).tickFormat(d3.format(".0f")));

  }, [data]);

  return (
    <svg ref={chartRef} width={860} height={400}></svg>
  );
};

export default DLineChart;
