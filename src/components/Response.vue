<template>
  <div class="button-container">
    <Button
      class="yes-button"
      v-show="response !== 'yes'"
      @click="response = 'yes'"
      >Yes</Button
    >
    <Button class="chosen yes-button" v-show="response === 'yes'">Yes</Button>
    <Button
      class="no-button"
      v-show="response !== 'no'"
      @click="response = 'no'"
      >No</Button
    >
    <Button class="chosen no-button" v-show="response === 'no'">No</Button>
    <Button class="submit-button" @click="$emit(`postResponse`, response)"
      >Submit</Button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "primevue/button";

export default defineComponent({
  name: `Answer`,
  components: {
    Button,
  },
  props: [],
  data: () => ({
    response: ``,
  }),
  methods: {},
  mounted() {},
});
</script>

<style scoped>
.button-container {
  display: grid;
  gap: 10px;
  grid-template-areas:
    "yes no"
    "submit submit";
}
.chosen {
  background-color: #f0f0f0 !important;
}
.yes-button {
  grid-area: yes;
  background-color: #4caf50;
}
.no-button {
  grid-area: no;
  background-color: #f44336;
}
.submit-button {
  grid-area: submit;
}
</style>
