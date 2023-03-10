<script setup>
import { CdxCheckbox, CdxSearchInput } from "@wikimedia/codex";
import { computed, ref } from "vue";
import { useWikis } from "../composition.js";

const wikis = useWikis();

const searchInput = ref("");
const searchResults = computed(() => {
  if (searchInput.value) {
    const search = searchInput.value.toLowerCase();
    return wikis.value.filter((wiki) =>
      `${wiki.lang} ${wiki.title} ${wiki.link}`.toLowerCase().includes(search)
    );
  }
  return wikis.value;
});
</script>

<template>
  <div id="search-bar">
    <cdx-search-input
      v-model="searchInput"
      aria-label="Search"
      placeholder="English"
    />
  </div>
  <div id="language-grid">
    <cdx-checkbox v-for="wiki in searchResults" v-model="wiki.checked">
      <span style="text-transform: capitalize" v-html="wiki.title"></span>
    </cdx-checkbox>
  </div>
</template>

<style scoped>
#language-grid {
  width: 80%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

#search-bar {
  width: auto;
  max-width: 800px;
  margin: auto;
  margin-bottom: 1rem;
}
</style>
