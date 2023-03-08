<script setup>
import { CdxProgressBar } from '@wikimedia/codex';
import LanguagesSelector from './components/LanguagesSelector.vue';
import RecentChangesLog from './components/RecentChangesLog.vue';


</script>

<template>
  <main>
    <Suspense>
      <template #fallback>
        <cdx-progress-bar />
      </template>
      <div>
        <RecentChangesLog></RecentChangesLog>
        <LanguagesSelector></LanguagesSelector>
      </div>
    </Suspense>
  </main>
</template>

<style scoped>
main {
  margin-top: 1rem;
}
</style>
