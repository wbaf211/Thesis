import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './PieChart.css';

const PieChart = ({ label, data }) => {
  useEffect(() => {
    const width = 225;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    const keys = Object.keys(data[label]);
    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);

    const svg = d3
      .select(`#custom-pie-chart-container-${label}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const totalStudents = Object.values(data[label]).reduce((acc, count) => acc + count, 0);

    const pie = d3.pie().value(d => (d[1] / totalStudents) * 100);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll('arc').data(pie(Object.entries(data[label]))).enter().append('g');

    arcs
      .append('path')
      .attr('fill', (d, i) => color(keys[i]))
      .attr('d', arc)
      .on('mouseover', function (event, d) {
        const categoryCount = d.data[1];
        // Show tooltip on hover
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`${keys[d.index]}: ${categoryCount} students (${(d.data[1] / totalStudents * 100).toFixed(2)}%)`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', function () {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style('opacity', 0);
      });

    const tooltip = d3.select(`#custom-pie-chart-container-${label}`).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    arcs
      .filter(d => d.data[1] !== 0)
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text(d => `${(d.data[1] / totalStudents * 100).toFixed(2)}%`);
  }, [data, label]);

  return (
    <div className="pie-chart_container">
      <h1>{label}</h1>
      <div id={`custom-pie-chart-container-${label}`}></div>
    </div>
  );
};

export default PieChart;
