<template>
  <div>
    <h2>CS Publications Timeline (2011~2021)</h2>
    
    <LoadingSpinner v-if="loading" />
    <svg v-show="!loading" ref="svg"></svg>
  </div>
</template>

<script setup>
import * as d3 from "d3"
import { onMounted, ref } from "vue"
import { fetchTimeline } from "../services/api"
import LoadingSpinner from "./LoadingSpinner.vue"

const loading = ref(false)
const svg = ref(null)
const emit = defineEmits(["yearSelected"])
import mockData from "../mock/timeline_mock.json"

let selectedYear = null

onMounted(async () => {

    loading.value = true
    // const raw = await fetchTimeline()
    const raw = mockData
    loading.value = false


  const data = raw.map(d => ({
    year: +d[0],
    count: +d[1]
  }))

  const width = 900
  const height = 400
  const margin = { top: 30, right: 20, bottom: 50, left: 60 }

  const svgEl = d3.select(svg.value)
    .attr("width", width)
    .attr("height", height)

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top])

  let tooltip = d3.select("#timeline-tooltip")

  if (tooltip.empty()) {
    tooltip = d3.select("body")
      .append("div")
      .attr("id", "timeline-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(30,30,30,0.9)")
      .style("color", "white")
      .style("padding", "10px 14px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")   
      .style("box-shadow", "0 4px 14px rgba(0,0,0,0.25)")
      .style("opacity", 0)
      .style("z-index", 9999)
      .style("transition", "opacity 0.15s ease")
  }

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.count))

  svgEl.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#1f77b4")
    .attr("stroke-width", 4)
    .attr("d", line)

  const circles = svgEl.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.year))
    .attr("cy", d => y(d.count))
    .attr("r", 6)
    .attr("fill", "#1f77b4")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")

  circles
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 12)

      tooltip
        .style("opacity", 1)
        .html(`<b>Year:</b> ${d.year}<br/><b>Papers:</b> ${d.count}`)
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + "px")
    })
    .on("mouseout", function (event, d) {
      if (selectedYear !== d.year) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", 6)
      }
      tooltip.style("opacity", 0)
    })
    .on("click", function (event, d) {

      selectedYear = d.year

      circles
        .transition()
        .duration(200)
        .attr("fill", "#1f77b4")
        .attr("r", 6)

      d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "#ff7f0e")
        .attr("r", 12)

      emit("yearSelected", d.year)
    })

  svgEl.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))

  svgEl.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))

})
</script>