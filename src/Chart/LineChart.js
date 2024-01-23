import React, { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import './LineChart.css';

function LineChart({ totalStudentByYearList, hKey, sortedKeys, title }) {
    const svgRef = useRef();
    const [tooltipData, setTooltipData] = useState(null);

    console.log("d3: ", d3)

    useEffect(() => {
        const margin = { top: 20, bot: 50, left: 20, right: 200 };
        const containerHeight = 300;
        const width = 800 - margin.left - margin.right;
        const height = containerHeight + 40 - margin.top - margin.bot - 25;

        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${margin.left + 20}, ${margin.top})`);

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const x = d3.scaleBand()
            .domain(sortedKeys)
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(sortedKeys, key => totalStudentByYearList[key][`${hKey}`])])
            .nice()
            .range([height, 0]);

        const colorScale = d3.scaleOrdinal()
            .domain(sortedKeys)
            .range(['rgba(31,119,180,0.5)', 'rgba(255,127,14,0.5)', 'rgba(44,160,44,0.5)', 'rgba(214,39,40,0.5)', 'rgba(148,103,189,0.5)', 'rgba(140,86,75,0.5)', 'rgba(227,119,174,0.5)', 'rgba(127,127,127,0.5)', 'rgba(188,189,34,0.5)', 'rgba(23,190,207,0.5)']);

        const bars = svg.selectAll('.bar')
            .data(sortedKeys)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('rx', 5)
            .attr('x', (key) => x(key))
            .attr('y', (key) => y(totalStudentByYearList[key][`${hKey}`]))
            .attr('width', x.bandwidth())
            .attr('height', (key) => height - y(totalStudentByYearList[key][`${hKey}`]))
            .style('fill', (key) => colorScale(key))
            .on('mouseenter', function (event, key) {
                const barData = totalStudentByYearList[key];
                setTooltipData(barData);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.9);

                const tooltipX = event.pageX + 10;  // Thêm giá trị offset x
                const tooltipY = event.pageY - 28; // Thêm giá trị offset y
                tooltip.html(`<strong>${key}</strong><br>Students: ${barData[`${hKey}`]}`)
                    .style('left', `${tooltipX}px`)
                    .style('top', `${tooltipY}px`);

                d3.select(this).classed('hovered', true);
                svg.select(`.${key.replace(/\s/g, '')}-legend`).style('font-weight', 'bold');
            })
            .on('mouseleave', function (event, key) {
                setTooltipData(null);
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);

                d3.select(this).classed('hovered', false);
                svg.select(`.${key.replace(/\s/g, '')}-legend`).style('font-weight', 'normal');
            });

        svg.selectAll('.grid-line')
            .data(y.ticks().filter(d => d !== 0))
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('x2', width)
            .attr('y1', (d) => y(d))
            .attr('y2', (d) => y(d));

        bars.raise();

        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.append('g')
            .attr('class', 'yAxis')
            .call(d3.axisLeft(y));

        const legendSize = 18;
        const legendSpacing = 5;
        const legendsPerRow = Math.floor((height - margin.top - margin.bot) / (legendSize + legendSpacing));

        const legend = svg.selectAll(".legend")
            .data(sortedKeys)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (key, i) {
                const legendX = width + 10 + Math.floor(i / legendsPerRow) * 100;
                const legendY = (i % legendsPerRow) * (legendSize + legendSpacing);
                return `translate(${legendX},${legendY + 32})`;
            })
            .attr('class', (key) => key ? `${key.replace(/\s/g, '')}-legend` : '')
            .on('mouseenter', function (event, key) {
                if (key) {
                    d3.select(this).style('font-weight', 'bold');
                    svg.selectAll(`.${key.replace(/\s/g, '')}-bar`).classed('hovered', true);
                }
            })
            .on('mouseleave', function (event, key) {
                if (key) {
                    d3.select(this).style('font-weight', 'normal');
                    svg.selectAll(`.${key.replace(/\s/g, '')}-bar`).classed('hovered', false);
                }
            });

        legend.append("rect")
            .attr("width", legendSize)
            .attr("height", legendSize)
            .style("fill", (key) => colorScale(key))
            .style("opacity", 0.7);

        legend.append("text")
            .attr("x", legendSize + legendSpacing)
            .attr("y", legendSize / 2)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function (key) { return key ? key : ''; });

    }, [totalStudentByYearList]);

    return (
        <div style={{ height: '340px' }} className="line-chart container">
            <h1 style={{ "margin-left": "20px", "margin-top": "10px" }}>{title}</h1>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default LineChart;
