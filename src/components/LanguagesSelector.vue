<script setup>
import { CdxCheckbox, CdxSearchInput, CdxTabs, CdxTab } from "@wikimedia/codex";
import { computed, watch, ref } from "vue";
import { useWikis, useRecentChange } from "../composition.js";

const currentTab = ref("all");
const tabsData = [
  {
    name: "all",
    label: "All Sites",
  },
  {
    name: "bylang",
    label: "By Languages",
  },
  {
    name: "bytype",
    label: "By Type",
  }
];

const groupWikisByProperty = (wikis, property) => {
  const map = wikis.reduce((accumulator, wiki) => {
    if (accumulator.has(wiki[property])) {
      accumulator.get(wiki[property]).push(wiki);
    } else {
      accumulator.set(wiki[property], [wiki]);
    }
    return accumulator;
  }, new Map());

  let arr = [];
  for (const [key, value] of map.entries()) {
    arr.push({
      title: key,
      lang: key,
      link: value[0].link,
      checked: computed({
        get() {
          return value.find((wiki) => !wiki.checked) ? false : true;
        },
        set(newVal) {
          value.forEach((wiki) => (wiki.checked = newVal));
        },
      }),
    });
  }
  return arr;
};

const wikis = useWikis();
const wikisBylang = ref(groupWikisByProperty(wikis.value, "loc_lang"));
const wikisByType = ref(groupWikisByProperty(wikis.value, "type"));

const { filter } = useRecentChange();
// Watch every checkbox for change
wikis.value.forEach((wiki) => {
  watch(wiki, () => {
    wiki.checked ? filter.add(wiki.link) : filter.delete(wiki.link);
  });
});

const searchInput = ref("");

const searchData = computed(() => {
  if (currentTab.value === "bylang") {
    return wikisBylang.value;
  }
  if (currentTab.value === "bytype") {
    return wikisByType.value;
  }
  return wikis.value;
});

const searchResults = computed(() => {
  if (searchInput.value) {
    const search = searchInput.value.toLowerCase();
    return searchData.value.filter((wiki) =>
      `${wiki.lang} ${wiki.title} ${wiki.link}`.toLowerCase().includes(search)
    );
  }
  return searchData.value;
});
</script>

<template>
  <div id="selector-container">
    <cdx-search-input v-model="searchInput" aria-label="Search" placeholder="English" />
    <cdx-tabs v-model:active="currentTab" :framed="true">
      <cdx-tab v-for="(tab, index) in tabsData" :key="index" :name="tab.name" :label="tab.label">
        <div v-if="currentTab == tab.name" id="language-grid">
          <cdx-checkbox v-for="wiki in searchResults" v-model="wiki.checked" v-memo="[wiki.checked]">
            <span style="text-transform: capitalize" v-html="wiki.title"></span>
          </cdx-checkbox>
        </div>
      </cdx-tab>
    </cdx-tabs>
  </div>
</template>

<style scoped>
#language-grid {
  margin: 0 auto;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

#selector-container {
  width: auto;
  max-width: 800px;
  margin: auto;
  margin-bottom: 1rem;
}
</style>
