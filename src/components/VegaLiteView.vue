<!-- <template>
  <div class="vega-wrap">
    <div v-if="err" class="vega-error">{{ err }}</div>
    <div ref="container" class="vega-container"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps({
  spec: { type: Object, default: null }
})

const container = ref(null)
const err = ref("")
let view = null
const vl = await import("vega-lite")
console.log("vega-lite version:", vl?.version || vl?.default?.version)

async function render() {
  await embed(container.value, {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: { values: [{a: "A", b: 10}, {a: "B", b: 20}] },
  mark: "bar",
  encoding: {
    x: { field: "a", type: "nominal" },
    y: { field: "b", type: "quantitative" }
  }
})
  // err.value = ""
  // if (!container.value) return
  // container.value.innerHTML = ""

  // if (!props.spec) return

  // try {
  //   const mod = await import("vega-embed")
  //   const embed = mod.default ?? mod

  //   const result = await embed(container.value, props.spec, {
  //     actions: false,
  //     renderer: "canvas"
  //   })

  //   view = result.view
  // } catch (e) {
  //   err.value = String(e?.message || e)
  //   // eslint-disable-next-line no-console
  //   console.error(e)
  // }
}

watch(() => props.spec, () => render(), { deep: true })
onMounted(() => render())

onBeforeUnmount(() => {
  if (view) view.finalize()
})
</script>

<style scoped>
.vega-wrap {
  width: 100%;
}

.vega-container {
  width: 100%;
  min-height: 320px;
}

.vega-error {
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #b42318;
  color: #b42318;
  background: rgba(180, 35, 24, 0.08);
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style> -->
<template>
  <div class="wrap">
    <Message v-if="err" severity="error" :closable="false" class="mb">
      {{ err }}
    </Message>
    <div ref="container" class="container"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch, toRaw } from "vue"
import Message from "primevue/message"

const props = defineProps({
  spec: { type: Object, default: null }
})

const container = ref(null)
const err = ref("")
let view = null

function toPlainJson(obj) {
  if (!obj) return null
  const raw = toRaw(obj)
  
  return JSON.parse(JSON.stringify(raw))
}

async function render() {
  err.value = ""
  if (!container.value) return
  container.value.innerHTML = ""
  const fallbackSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: { values: [{ a: "A", b: 10 }, { a: "B", b: 20 }] },
    mark: "bar",
    encoding: {
      x: { field: "a", type: "nominal" },
      y: { field: "b", type: "quantitative" }
    }
  }
  
  const specToRender = toPlainJson(props.spec ?? fallbackSpec)
  

  try {
    const mod = await import("vega-embed")
    const embed = mod.default ?? mod

    const result = await embed(container.value, specToRender, {
      actions: false,
      renderer: "canvas"
    })

    view = result.view
  } catch (e) {
    err.value = String(e?.message || e)
    console.error(e)
  }
}

watch(() => props.spec, () => render(), { deep: true })
onMounted(() => render())

onBeforeUnmount(() => {
  if (view) view.finalize()
})
</script>

<style scoped>
.wrap { width: 100%; }
.container { width: 100%; min-height: 340px; }
.mb { margin-bottom: 10px; }
</style>