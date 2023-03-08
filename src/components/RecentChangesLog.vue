<script setup>
import { ref, watch } from 'vue';
import { useWikis } from '../composition.js';

const wikis = useWikis();
const toFilter = new Set();
const listenCounter = ref(0);
const recentChanges = ref([]);

// Watch every checkbox for change
wikis.value.forEach((wiki) => {
  watch(wiki, () => {
    wiki.checked ? toFilter.add(wiki.link) : toFilter.delete(wiki.link);
  });
});

const url = 'https://stream.wikimedia.org/v2/stream/recentchange';
const eventSource = new EventSource(url);

eventSource.onopen = () => {
  console.info('Opened connection.');
};
eventSource.onerror = (event) => {
  console.error('Encountered error', event);
};
eventSource.onmessage = (event) => {
  // event.data will be a JSON message
  const data = JSON.parse(event.data);
  if (toFilter.has(data.server_name)) {
    console.log(data);
    listenCounter.value++;
    if (recentChanges.value.length > 10) {
      recentChanges.value.shift();
    }
    recentChanges.value.push(data);
  }
};
</script>

<template>
  <div id="recent-changes-log">
    <div id="log">
      <TransitionGroup name="list" tag="ul">
        <li v-for="change in recentChanges" :key="change.id ?? change.log_id">
          {{ `${change.user} changed ${decodeURI(change.meta.uri)}` }}
        </li>
      </TransitionGroup>
    </div>
    <div style="margin-bottom: 1rem; text-align: center;">
      You have listened to a total of <span id="edit-counter"> {{ listenCounter }} edits</span>.
    </div>
  </div>
</template>

<style scoped>
#log {
  width: auto;
  height: 20rem;
  max-width: 800px;
  overflow: hidden;
  margin: 1rem auto;
  border-style: var(--border-style-base);
  border-width: var(--border-width-base);
  border-color: var(--border-color-inverted);
}

#edit-counter {
  color: var(--color-destructive);
}

.list-enter-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

ul {
  list-style: none;
}
</style>