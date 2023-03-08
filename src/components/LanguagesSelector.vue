<script setup>
import { CdxCheckbox } from '@wikimedia/codex';
import { useWikis } from '../composition.js';

const wikis = useWikis();
</script>

<template>
  <div id="language-grid">
    <cdx-checkbox v-for="wiki in wikis" v-model="wiki.checked">
      <span style="text-transform: capitalize;" v-html="wiki.title"></span>
    </cdx-checkbox>
  </div>
</template>

<style scoped>
#language-grid {
  width: 80%;
  margin: 0 auto;
  display: grid;
  text-align: left;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>