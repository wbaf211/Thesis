import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GrpLineChart = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 1000 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

    const svg = d3
        .select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + data[0].grade.length); // Assuming all students have the same number of grades

    const dateScale = d3.scaleTime()
                        .domain([startDate, endDate])
                        .range([0, width]);

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const xAxis = d3.axisBottom(dateScale)
                    .ticks(d3.timeMonth.every(1))
                    .tickFormat(d3.timeFormat('%b %Y'));

    svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis);
    svg.append('g').call(d3.axisLeft(y));

    data.forEach((student) => {
    const line = d3.line()
                    .x((d, i) => dateScale(new Date(startDate).setMonth(startDate.getMonth() + i)))
                    .y((d) => y(student.grade[d]));

    svg.append('path')
        .datum(Object.keys(student.grade))
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);
    });
}, [data]);

    return (
        <div>
        <svg ref={svgRef}></svg>
        </div>
    );
};

export default GrpLineChart;
