<template>
  <div v-if="rows && rows.length">
    <DataTable
      :value="rows"
      :paginator="rows.length > 10"
      :rows="10"
      size="small"
      stripedRows
      scrollable
      scrollHeight="260px"
    >
      <Column v-for="c in columns" :key="c" :field="c" :header="c" />
    </DataTable>
  </div>

  <div v-else class="muted">No preview rows.</div>
</template>

<script setup>
import { computed } from "vue"
import DataTable from "primevue/datatable"
import Column from "primevue/column"

const props = defineProps({
  rows: { type: Array, default: () => [] }
})

const columns = computed(() => {
  if (!props.rows?.length) return []
  const set = new Set()
  for (const r of props.rows) Object.keys(r || {}).forEach((k) => set.add(k))
  return Array.from(set)
})
</script>

<style scoped>
.muted { opacity: 0.7; font-size: 0.9rem; }
</style>