<script setup>
import { ref, watch } from "vue";
import { useWikis, useRecentChange } from "../composition.js";
import {Howl, Howler} from 'howler';

const wikis = useWikis();
const { filter, recentChange } = useRecentChange();
const listenCounter = ref(0);
const recentChanges = ref([]);

let celesta = []
let clav = []
let swells = []
load_sounds();

// Watch every checkbox for change
wikis.value.forEach((wiki) => {
  watch(wiki, () => {
    wiki.checked ? filter.add(wiki.link) : filter.delete(wiki.link);
  });
});

watch(recentChange, () => {
  listenCounter.value++;
  if (recentChanges.value.length > 10) {
    recentChanges.value.shift();
  }
  recentChanges.value.push(recentChange.value.data);

  const [orig_size, scaled_size] = calculate_size(recentChange.value.data);
  if (orig_size > 0) {
    play_sound(scaled_size, 'add')
  } else {
    play_sound(scaled_size, 'sub')
  }
});

function calculate_size(data) {
  try {
    const scale_factor = 5
    let orig_size = data.length.new - data.length.old
    const abs_size = Math.abs(orig_size);
    let scaled_size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);
    return [orig_size, scaled_size];
  } catch (e) {
    console.log(e);
    console.log(JSON.stringify(data));
    return [0, 0];
  }
}

function load_sounds() {
  // load celesta and clav sounds
  let filename = null
  for (let i = 1; i <= 24; i++) {
    if (i > 9) {
      filename = 'c0' + i
    } else {
      filename = 'c00' + i
    }
    celesta.push(new Howl({
      src : ['sounds/celesta/' + filename + '.ogg',
        'sounds/celesta/' + filename + '.mp3'],
      volume : 0.2
    }))
    clav.push(new Howl({
      src : ['sounds/clav/' + filename + '.ogg',
        'sounds/clav/' + filename + '.mp3'],
      volume : 0.2
    }))
  }

  // load swell sounds
  for (let i = 1; i <= 3; i++) {
    swells.push(new Howl({
      src : ['sounds/swells/swell' + i + '.ogg',
        'sounds/swells/swell' + i + '.mp3'],
      volume : 1
    }))
  }
}

function play_sound(size, type) {
  const max_pitch = 100.0;
  const log_used = 1.0715307808111486871978099;
  const pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
  let index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
  const fuzz = Math.floor(Math.random() * 4) - 2;
  index += fuzz;
  index = Math.min(Object.keys(celesta).length - 1, index);
  index = Math.max(1, index);

  // TODO: do we want to cap amount of currently playing sounds like in the original version?
  if (type == 'add') {
    celesta[index].play();
  } else {
    clav[index].play();
  }
}

// TODO: Need to figure were to get new user events from
function play_random_swell() {
  var index = Math.round(Math.random() * (swells.length - 1));
  swells[index].play();
}
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
    <div style="margin-bottom: 1rem; text-align: center">
      You have listened to a total of
      <span id="edit-counter"> {{ listenCounter }} edits</span>.
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
