import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RadarChart({ data, labelData, selectedRows }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    d3.select(chartRef.current).selectAll('*').remove();

    let width = 800;
    let height = 300;
    let numFeatures = labelData.length;
    let angleScale = d3.scaleLinear().domain([0, numFeatures]).range([0, 2 * Math.PI]);
    let radius = 125;
    let labelCoordinates = [];

    for (let i = 0; i < numFeatures; i++) {
      let angle = angleScale(i);
      let x = width / 2 + Math.cos(angle) * radius;
      let y = height / 2 + Math.sin(angle) * radius;
      labelCoordinates.push({ x, y });
    }

    let newFeatures = ["I", "J", "K", "L"];
    let numTotalFeatures = numFeatures + newFeatures.length;
    let angleIncrement = (2 * Math.PI) / numTotalFeatures;
    let newLabelCoordinates = [];

    for (let i = numFeatures; i < numTotalFeatures; i++) {
      let angle = angleScale(i - numFeatures) + angleIncrement / 2;
      let x = width / 2 + Math.cos(angle) * radius;
      let y = height / 2 + Math.sin(angle) * radius;
      newLabelCoordinates.push({ x, y });
    }

    const svg = d3.select(chartRef.current).append("svg")
      .attr("width", width)
      .attr("height", height);

    const radialScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 125]);

    const ticks = [20, 40, 60, 80, 100];

    const chartGroup = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    chartGroup.selectAll("circle")
      .data(ticks)
      .enter()
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", (d) => (radialScale(d) / 10));

    chartGroup.selectAll(".ticklabel")
      .data(ticks)
      .enter()
      .append("text")
      .attr("class", "ticklabel")
      .attr("x", 5)
      .attr("y", (d) => -radialScale(d) / 10 + 20)
      .text((d) => d.toString());

    function angleToCoordinate(angle, value) {
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      let xLabel = Math.cos(angle) * radialScale(value + 0.5) * 1.4 - 45;
      let yLabel = Math.sin(angle) * radialScale(value + 0.5) - 5;
      return { "x": x, "y": -y, "xLabel": xLabel, "yLabel": -yLabel };
    }

    let featureData = labelData.map((f, i) => {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / numFeatures);
      return {
        "name": f,
        "angle": angle,
        "line_coord": angleToCoordinate(angle, 10),
        "label_coord": angleToCoordinate(angle, 10.5)
      };
    });

    chartGroup.selectAll("line")
      .data(featureData)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => d.line_coord.x)
      .attr("y2", (d) => d.line_coord.y)
      .attr("stroke", "black");

    chartGroup.selectAll(".axislabel")
      .data(featureData)
      .enter()
      .append("text")
      .attr("x", (d) => d.label_coord.xLabel)
      .attr("y", (d) => d.label_coord.yLabel)
      .text((d) => d.name);

    function getPathCoordinates(data_point) {
      let coordinates = [];
      for (var i = 0; i < numFeatures; i++) {
        let ft_name = labelData[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / numFeatures);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }

    let line = d3.line()
      .x((d) => d.x)
      .y((d) => d.y);

    let colors = ["darkorange", "gray", "navy", "red", "yellow"];

    const uniqueIds = [...new Set(selectedRows.map(row => row.id))];

    const legend = svg.selectAll(".legend")
      .data(uniqueIds)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
      .attr("x", width - 140)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (_, i) => colors[i]);

    legend.append("text")
      .attr("x", width - 15)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(d => d);

    let paths = chartGroup.selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .datum((d) => getPathCoordinates(d))
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", (_, i) => colors[i])
      .attr("fill", "none")
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);

    paths.each(function (d, i) {
      d3.select(this).attr("fill", colors[i]).attr("fill-opacity", 0.2);
    });

    paths.on("mouseover", function (event, d) {
      d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 4);
      d3.select(this).attr("fill-opacity", 0.8);
      
      const tooltip = d3.select(chartRef.current).append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .html(`<strong>Details:</strong><br/>${JSON.stringify(d[0], null, 2)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    });

    paths.on("mouseout", function () {
      d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 3);
      d3.select(this).attr("fill-opacity", 0.2);
      d3.select(".tooltip").remove();
    });
  }, [labelData, selectedRows]);

  return (
    <div style={{ height: '340px', width: '830px' }} className="radar container">
      <h1 style={{ marginLeft: '20px', marginTop: '10px' }}>Student's Classify Distribution Chart</h1>
      <svg ref={chartRef} width={830} height={300}></svg>
    </div>
  );
}

export default RadarChart;
