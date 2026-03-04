<template>
  <ScrollPanel class="panel" ref="panelRef">
    <div class="chatStack">
      <div
        v-for="m in messages"
        :key="m.id"
        class="msgRow"
        :class="m.role === 'user' ? 'rowUser' : 'rowAssistant'"
      >
        <div class="bubbleWrapper">
          
          <div class="bubble"
               :class="m.role === 'user' ? 'bubbleUser' : 'bubbleAssistant'">

            <div class="bubbleHeader">
              <span class="role">
                {{ m.role === 'user' ? 'You' : 'Assistant' }}
              </span>

              <span v-if="m.intent" class="intent">
                {{ m.intent }}
              </span>
            </div>

            <div class="bubbleText">
              {{ m.text }}
            </div>

          </div>
        </div>
      </div>
    </div>
  </ScrollPanel>
</template>
<script setup>
import { nextTick, onUpdated, ref } from "vue"
import ScrollPanel from "primevue/scrollpanel"

defineProps({
  messages: { type: Array, required: true }
})

const panelRef = ref(null)

async function scrollToBottom() {
  await nextTick()
  const el = panelRef.value?.$el
  if (!el) return
  const content = el.querySelector(".p-scrollpanel-content")
  if (content) content.scrollTop = content.scrollHeight
}

onUpdated(() => {
  scrollToBottom()
})
</script>
<style scoped>

/* Panel 改成深色层级，而不是浅色渐变 */
.panel {
  height: 460px;
  border-radius: 16px;
  background: linear-gradient(180deg, #0f1115, #0b0c10);
  border: 1px solid rgba(255,255,255,0.06);
}

/* 内边距稍微紧一点 */
.chatStack {
  padding: 22px 20px;
}

/* 每行间距 */
.msgRow {
  display: flex;
  margin-bottom: 18px;
}

.rowUser {
  justify-content: flex-end;
}

.rowAssistant {
  justify-content: flex-start;
}


.bubbleWrapper {
  max-width: 65%;
}


.bubble {
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
  transition: all 0.15s ease;
  backdrop-filter: blur(6px);
  max-width: 520px;
}


.bubbleAssistant {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.92);
  box-shadow: 0 8px 26px rgba(0,0,0,0.25);
  border-top-left-radius: 6px;
}


.bubbleUser {
  background: linear-gradient(
    135deg,
    #1e3b28,
    #0f2a15
  );
  border: 1px solid rgba(255,255,255,0.06);
  color: white;
  box-shadow: 0 10px 28px rgba(0,0,0,0.35);
  border-top-right-radius: 6px;
}


.bubbleHeader {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 6px;
  opacity: 0.6;
  letter-spacing: 0.3px;
  font-weight: 500;
}


.intent {
  font-style: normal;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.08);
  opacity: 0.8;
}


.bubbleText {
  white-space: pre-wrap;
  line-height: 1.55;
  font-size: 14px;
  text-align: left;
}


.bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(0,0,0,0.45);
}

</style>