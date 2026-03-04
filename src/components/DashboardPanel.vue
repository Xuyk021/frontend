<template>
  <Card>
    <template #title>Dashboard</template>
    <template #content>
      <div v-if="!payload" class="muted">
        Ask a question to generate a chart.
      </div>

      <div v-else>
        <div class="topline">
          <Tag severity="info" :value="`intent: ${payload.intent || 'unknown'}`" />
          <Tag
            v-if="payload.meta?.n_rows !== undefined"
            severity="secondary"
            :value="`rows: ${payload.meta.n_rows}`"
          />
        </div>

        <div v-if="payload.vega_lite_spec">
          <VegaLiteView :spec="payload.vega_lite_spec" />
        </div>
        <Message v-else severity="error" :closable="false" class="mt">
          No Vega-Lite spec returned.
          <span v-if="payload.issues?.length"> Issues: {{ payload.issues.join("; ") }}</span>
        </Message>

        <Accordion :multiple="true" class="mt">
          <AccordionPanel value="sql">
            <AccordionHeader>SQL</AccordionHeader>
            <AccordionContent>
              <pre class="code">{{ payload.sql || "" }}</pre>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="preview">
            <AccordionHeader>Data preview</AccordionHeader>
            <AccordionContent>
              <DataPreviewTable :rows="payload.data_preview || []" />
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel value="meta">
            <AccordionHeader>Meta</AccordionHeader>
            <AccordionContent>
              <pre class="code">{{ JSON.stringify(payload.meta || {}, null, 2) }}</pre>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from "primevue/card"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import Tag from "primevue/tag"
import Message from "primevue/message"

import VegaLiteView from "./VegaLiteView.vue"
import DataPreviewTable from "./DataPreviewTable.vue"

defineProps({
  payload: { type: Object, default: null }
})
</script>

<style scoped>
.muted { opacity: 0.7; }
.topline { display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.mt { margin-top: 14px; }
.code {
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
}
</style>