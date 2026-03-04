<template>
  <div class="page">
    <h1 class="title">SciSciNet Network Visualization</h1>

    <TabView v-model:activeIndex="activeIndex">

      <!-- <TabPanel header="Citation Graph">
        <CitationGraph />
      </TabPanel> -->

      <TabPanel header="Author Graph">
        <AuthorGraph />
      </TabPanel>

      <TabPanel header="Dashboard">
        <Dashboard />
      </TabPanel>

      <TabPanel header="Chat">
        <ChatDashboardPage />
      </TabPanel>

    </TabView>

  </div>
</template>

<script setup>
import { ref } from "vue"

import TabView from "primevue/tabview"
import TabPanel from "primevue/tabpanel"

import CitationGraph from "./CitationGraph.vue"
import AuthorGraph from "./AuthorGraph.vue"
import Dashboard from "./Dashboard.vue"
import ChatDashboardPage from "./ChatDashboardPage.vue"

const activeIndex = ref(3) 
</script>

<style scoped>
.page {
  padding: 24px;
}

.title {
  margin-bottom: 20px;
}


:deep(.p-tabview-panels) {
  padding: 24px;
  background: var(--surface-50);
  border-radius: 16px;
}
</style>