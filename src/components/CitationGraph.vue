<template>
  <div class="network-container">
    <h2>Paper Citation Network (Last 5 Years)</h2>
    <svg ref="svg"></svg>
  </div>
</template>

<script setup>
import * as d3 from "d3"
import { onMounted, ref } from "vue"
import { fetchCitationNetwork } from "../services/api"

const svg = ref(null)

onMounted(async () => {

  const data = await fetchCitationNetwork()

  const width = 900
  const height = 600

  const svgEl = d3.select(svg.value)
    .attr("width", width)
    .attr("height", height)
    .style("background", "#fafafa")


  const zoomLayer = svgEl.append("g")

  svgEl.call(
    d3.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", e =>
        zoomLayer.attr("transform", e.transform)
      )
  )


  let tooltip = d3.select("#tooltip")

  if (tooltip.empty()) {
    tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
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

  const showTooltip = (event, html) => {
    tooltip
      .html(html)
      .style("opacity", 1)
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY + 15 + "px")
  }

  const moveTooltip = event => {
    tooltip
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY + 15 + "px")
  }

  const hideTooltip = () =>
    tooltip.style("opacity", 0)

  // =====================================================
  // INITIAL POSITIONS
  // =====================================================
  data.nodes.forEach(d => {
    d.x = Math.random() * width
    d.y = Math.random() * height
  })

  // =====================================================
  // SIMULATION
  // =====================================================
  const simulation = d3.forceSimulation(data.nodes)
    .force(
      "link",
      d3.forceLink(data.links)
        .id(d => d.id)
        .distance(90)
    )
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide(8))

  // =====================================================
  // LINKS
  // =====================================================
  const link = zoomLayer.append("g")
    .attr("stroke", "#aaa")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")

  link
    .on("mouseover", (event, d) =>
      showTooltip(event, `
        <b>Citation Edge</b><br/>
        Source: ${d.source.id}<br/>
        Target: ${d.target.id}
      `)
    )
    .on("mousemove", moveTooltip)
    .on("mouseout", hideTooltip)

  // =====================================================
  // NODES
  // =====================================================
  const node = zoomLayer.append("g")
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 6)
    .attr("fill", "#1f77b4")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)

  node.on("mousedown", e => e.stopPropagation())


  node
    .on("mouseover", function (event, d) {

      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 9)
        .attr("fill", "#ff7f0e")

      showTooltip(event, `
        <b>Paper</b><br/>
        ID: ${d.id}<br/>
        Year: ${Math.floor(d.year ?? 0) || "N/A"}<br/>
        Citations: ${Math.floor(d.citations ?? 0)}
      `)
    })
    .on("mousemove", moveTooltip)
    .on("mouseout", function () {

      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 6)
        .attr("fill", "#1f77b4")

      hideTooltip()
    })

  // =====================================================
  // DRAG
  // =====================================================
  node.call(
    d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  )

  function dragstarted(event, d) {
    if (!event.active)
      simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event, d) {
    if (!event.active)
      simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  // =====================================================
  // TICK
  // =====================================================
  simulation.on("tick", () => {

    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
  })

})
</script>

<style>
.network-container {
  position: relative;
}
</style>