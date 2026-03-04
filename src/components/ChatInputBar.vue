<template>
  <div class="bar">
    <InputText
      v-model="draft"
      class="w-full"
      placeholder="Ask: show me the number of papers by year"
      @keyup.enter="onSend"
      :disabled="loading"
    />
    <Button label="Send" icon="pi pi-send" @click="onSend" :loading="loading" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import InputText from "primevue/inputtext"
import Button from "primevue/button"

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(["send"])

const draft = ref("")

function onSend() {
  const msg = draft.value.trim()
  if (!msg || props.loading) return
  emit("send", msg)
  draft.value = ""
}
</script>

<style scoped>
.bar {
  display: flex;
  gap: 10px;
  align-items: center;
}
.w-full {
  flex: 1;
}
</style>