<template>
  <div>
    <h2 v-if="year">
      Patent Citation Distribution ({{ year }})
    </h2>
    <h2 v-else>
      Click a year in the timeline to view distribution
    </h2>

    <LoadingSpinner v-if="loading" />
    <svg v-show="!loading" ref="svg"></svg>
  </div>
</template>

<script setup>
import * as d3 from "d3"
import { watch, ref } from "vue"
import { fetchPatentHistogram } from "../services/api"
import LoadingSpinner from "./LoadingSpinner.vue"

const props = defineProps({
  year: Number
})

const svg = ref(null)

const loading = ref(false)
const width = 900
const height = 400
const margin = { top: 20, right: 20, bottom: 50, left: 60 }


watch(() => props.year, async (newYear) => {

  if (!newYear) return   // 

  loading.value = true
  console.log("loading histogram for year", newYear)
  const raw = await fetchPatentHistogram(newYear)
  console.log("data received")
  loading.value = false

  const svgEl = d3.select(svg.value)
    .attr("width", width)
    .attr("height", height)

  svgEl.selectAll("*").remove()

  if (!raw.length) return

  const MAX_DISPLAY = 20
  const data = raw.map(d => d > MAX_DISPLAY ? MAX_DISPLAY : d)


  const x = d3.scaleLinear()
    .domain([0, MAX_DISPLAY])
    .range([margin.left, width - margin.right])

  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(MAX_DISPLAY)(data)

  const y = d3.scaleLog()
    .domain([1, d3.max(bins, d => d.length)])
    .range([height - margin.bottom, margin.top])

  let tooltip = d3.select("#hist-tooltip")

  if (tooltip.empty()) {
    tooltip = d3.select("body")
      .append("div")
      .attr("id", "hist-tooltip")
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

  // ----------------------------
  // Bars
  // ----------------------------
  svgEl.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", d => x(d.x0))
    .attr("y", d => y(Math.max(1, d.length)))
    .attr("width", d => x(d.x1) - x(d.x0) - 2)
    .attr("height", d => height - margin.bottom - y(Math.max(1, d.length)))
    .attr("fill", "#ff7f0e")
    .on("mouseover", (event, d) => {
      tooltip
        .style("opacity", 1)
        .html(`
          <b>Patent Count:</b> ${d.x0 === MAX_DISPLAY ? "20+" : d.x0}<br/>
          <b># Papers:</b> ${d.length}
        `)
    })
    .on("mousemove", (event) => {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + "px")
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0)
    })

  // ----------------------------
  // Axes
  // ----------------------------
  svgEl.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d => d === MAX_DISPLAY ? "20+" : d)
    )

  svgEl.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5, "~s"))

})
</script>