import { ref, shallowReactive, toRaw, watch } from "vue";

const domParser = new DOMParser();
const wikis = await fetch("https://wikistats.wmcloud.org/wikimedias_csv.php")
  .then((res) => res.text())
  .then((res) =>
    // Ref makes entire array reactive
    ref(
      res
        .split("\n")
        .map((row) => row.split(","))
        .filter((row) => row[2] !== "special")
        .map((row) => ({
          lang: row[3],
          title: domParser.parseFromString(`${row[4]} ${row[2]}`, "text/html")
            .documentElement.textContent,
          link: `${row[1]}.${row[2]}.org`,
          checked: false,
        }))
        .slice(1, -1)
    )
  );

console.log(wikis);

export const useWikis = () => wikis;

const filter = shallowReactive(new Set());
const recentChange = ref();
const worker = new SharedWorker(new URL("./sharedworker.js", import.meta.url));

worker.port.onmessage = (e) => {
  recentChange.value = e;
};

watch(filter, () => {
  worker.port.postMessage(toRaw(filter));
});

/**
 * @typedef {UseRecentChangeReturn} UseRecentChangeReturn
 * @property {ShallowReactive<Set<String>>} filter - The server name filter used for recent changes
 * @property {Ref<MessageEvent<any>>} recentChange - The most recent change event
 *
 * @returns {UseRecentChangeReturn} UseRecentChangeReturn
 */
export const useRecentChange = () => ({
  filter,
  recentChange,
});
