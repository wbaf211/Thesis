import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function RadarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    let data = [];
    let width = 300;
    let height = 300;
    let features = ["A", "B", "C", "D", "E", "F", "G", "H"]; // Các label hiện có
    let numFeatures = features.length; // Số lượng label hiện có
    let numNewFeatures = 4; // Số lượng label mới muốn thêm
    // Tính toán góc và tọa độ cho các label
    let angleScale = d3.scaleLinear().domain([0, numFeatures]).range([0, 2 * Math.PI]);
    let radius = 125;
    let labelCoordinates = [];
    for (let i = 0; i < numFeatures; i++) {
      let angle = angleScale(i);
      let x = width / 2 + Math.cos(angle) * radius;
      let y = height / 2 + Math.sin(angle) * radius;
      labelCoordinates.push({ x, y });
    }
    let newFeatures = ["I", "J", "K", "L"]; // Các label mới muốn thêm
    let numTotalFeatures = numFeatures + numNewFeatures; // Tổng số label sau khi thêm mới
    let angleIncrement = (2 * Math.PI) / numTotalFeatures; // Góc giữa các label
    // Tính toán tọa độ cho các label mới
    let newLabelCoordinates = [];
    for (let i = numFeatures; i < numTotalFeatures; i++) {
      let angle = angleScale(i - numFeatures) + angleIncrement / 2; // Đảm bảo label mới nằm giữa 2 label cũ
      let x = width / 2 + Math.cos(angle) * radius;
      let y = height / 2 + Math.sin(angle) * radius;
      newLabelCoordinates.push({ x, y });
    }
    //generate the data
    for (var i = 0; i < 3; i++) {
      var point = {};
      features.forEach((f) => (point[f] = 1 + Math.random() * 8));
      data.push(point);
    }

    const svg = d3.select(chartRef.current).append("svg")
      .attr("width", width)
      .attr("height", height);
    const radialScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 125]);
    const ticks = [20, 40, 60, 80, 100];
    svg.selectAll("circle")
      .data(ticks)
      .enter()
      .append("circle")
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", (d) => (radialScale(d) / 10));

    svg.selectAll(".ticklabel")
      .data(ticks)
      .enter()
      .append("text")
      .attr("class", "ticklabel")
      .attr("x", width / 2 + 5)
      .attr("y", (d) => height / 2 - (radialScale(d) / 10))
      .text((d) => d.toString());

    function angleToCoordinate(angle, value) {
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      let xLabel = Math.cos(angle) * radialScale(value + 0.5) - 5;
      let yLabel = Math.sin(angle) * radialScale(value + 0.5) - 5;
      return { "x": width / 2 + x, "y": height / 2 - y, "xLabel": width / 2 + xLabel, "yLabel": height / 2 - yLabel };
    }

    let featureData = features.map((f, i) => {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / numFeatures);
      return {
        "name": f,
        "angle": angle,
        "line_coord": angleToCoordinate(angle, 10),
        "label_coord": angleToCoordinate(angle, 10.5)
      };
    });

    // draw axis line
    svg.selectAll("line")
      .data(featureData)
      .enter()
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr("x2", (d) => d.line_coord.x)
      .attr("y2", (d) => d.line_coord.y)
      .attr("stroke", "black");

    // draw axis label
    svg.selectAll(".axislabel")
      .data(featureData)
      .enter()
      .append("text")
      .attr("x", (d) => d.label_coord.xLabel)
      .attr("y", (d) => d.label_coord.yLabel)
      .text((d) => d.name);

    let line = d3.line()
      .x((d) => d.x)
      .y((d) => d.y);
    let colors = ["darkorange", "gray", "navy"];
    function getPathCoordinates(data_point) {
      let coordinates = [];
      for (var i = 0; i < numFeatures; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / numFeatures);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }

    let paths = svg.selectAll("path")
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

    // Thêm màu và opacity cho hình khép kín
    paths.each(function (d, i) {
      d3.select(this).attr("fill", colors[i]).attr("fill-opacity", 0.2);
    });

    // Bổ sung sự kiện hover
    paths.on("mouseover", function (event, d) {
      d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 4);
      d3.select(this).attr("fill-opacity", 0.8);
      const tooltip = d3.select(chartRef.current).append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .html(JSON.stringify(d, null, 2))
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
    });

    paths.on("mouseout", function () {
      d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 3);
      d3.select(this).attr("fill-opacity", 0.2);
      d3.select(".tooltip").remove();
    });
  }, []);

  return <div ref={chartRef}></div>;
}

export default RadarChart;
