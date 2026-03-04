<template>
  <div>
    <TimelineChart @yearSelected="selectedYear = $event" />
    <PatentHistogram :year="selectedYear" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import TimelineChart from "./TimelineChart.vue"
import PatentHistogram from "./PatentHistogram.vue"

const selectedYear = ref(null)
</script>