<script setup>
import { onMounted, watch } from "vue";
import * as d3 from "d3";
import { useRecentChange } from "../composition.js";

const { recentChange } = useRecentChange();

const width = 1000;
const height = 1000;
// TODO: Move these options out of this file
const scale_factor = 5,
  note_overlap = 15,
  note_timeout = 300,
  current_notes = 0,
  max_life = 60000,
  DEFAULT_LANG = "en";

const body_background_color = "#f8f8f8",
  body_text_color = "#000",
  svg_background_color = "#1c2733",
  svg_text_color = "#fff",
  newuser_box_color = "rgb(41, 128, 185)",
  bot_color = "rgb(155, 89, 182)",
  anon_color = "rgb(46, 204, 113)",
  edit_color = "#fff",
  sound_totals = 51,
  total_edits = 0;

let silent = false;

onMounted(() => {
  let svg = d3
    .select("#area")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .classed("svg-content", true)
    .style("background-color", "#1c2733");

  // TODO: Change color based on change type
  watch(recentChange, () => {
    const data = recentChange.value.data;
    console.log(data);
    let size = data.length ? data.length.new - data.length.old : 10;
    let label_text = data.title;
    let no_label = true;
    let type = data.type;
    let starting_opacity = silent ? 0.2 : 1;

    const circle_id = "d" + ((Math.random() * 100000) | 0);
    const abs_size = Math.abs(size);
    size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);

    const x = Math.random() * (width - size) + size;
    const y = Math.random() * (height - size) + size;

    const circle_group = svg
      .append("g")
      .attr("transform", "translate(" + x + ", " + y + ")")
      .attr("fill", edit_color)
      .style("opacity", starting_opacity);

    const ring = circle_group
      .append("circle")
      .attr("r", size + 20)
      .attr("stroke", "none")
      .transition()
      .attr("r", size + 40)
      .style("opacity", 0)
      .ease(Math.sqrt)
      .duration(2500)
      .remove();

    const circle_container = circle_group
      .append("a")
      .attr("xlink:href", data.url)
      .attr("target", "_blank")
      .attr("fill", svg_text_color);

    const circle = circle_container
      .append("circle")
      .classed(type, true)
      .attr("r", size)
      .transition()
      .duration(max_life)
      .style("opacity", 0)
      .on("end", function () {
        circle_group.remove();
      })
      .remove();

    circle_container.on("mouseover", function () {
      if (no_label) {
        no_label = false;
        circle_container
          .append("text")
          .text(label_text)
          .classed("article-label", true)
          .attr("text-anchor", "middle")
          .transition()
          .delay(1000)
          .style("opacity", 0)
          .duration(2000)
          .on("end", function () {
            no_label = true;
          })
          .remove();
      }
    });
  });
});
</script>
<template>
  <div id="area"></div>
</template>
<style scoped></style>
