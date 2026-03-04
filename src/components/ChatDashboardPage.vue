<template>
  <div class="page">
    <Toast />

    <div class="grid">
      <Card class="leftCard">
        <template #title>Chatbot</template>
        <template #content>
          <ChatMessageList :messages="messages" />

          <Divider />

          <ChatInputBar :loading="loading" @send="handleSend" />

          <div class="hint">
            Try: "show me the number of papers by year", "papers by field", "papers by author"
          </div>
        </template>
      </Card>

      <DashboardPanel class="rightCard" :payload="latestPayload" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import Toast from "primevue/toast"
import { useToast } from "primevue/usetoast"
import Card from "primevue/card"
import Divider from "primevue/divider"

import ChatMessageList from "./ChatMessageList.vue"
import ChatInputBar from "./ChatInputBar.vue"
import DashboardPanel from "./DashboardPanel.vue"

import { chat as chatApi } from "../services/api"

const toast = useToast()

const loading = ref(false)
const messages = ref([
  {
    id: crypto.randomUUID(),
    role: "assistant",
    text: "Ask me about PSU papers. I can generate interactive Vega-Lite charts."
  }
])

const latestPayload = ref(null)

async function handleSend(text) {
  messages.value.push({ id: crypto.randomUUID(), role: "user", text })

  loading.value = true
  try {
    const res = await chatApi(text)

    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      text: res.assistant_text || "Done.",
      intent: res.intent || null
    })

    latestPayload.value = res
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Request failed",
      detail: String(e?.message || e),
      life: 3500
    })
    messages.value.push({
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Request failed. Check backend logs."
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page { padding: 16px; }

.grid {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 14px;
  align-items: start;
}

.leftCard { min-width: 360px; }
.rightCard { min-width: 360px; }

.hint {
  margin-top: 10px;
  font-size: 0.85rem;
  opacity: 0.7;
}

@media (max-width: 1100px) {
  .grid { grid-template-columns: 1fr; }
}
</style>