<template>
  <button @click="postYes">Yes</button>
  <button @click="postNo">No</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: `Answer`,
  props: [],
  data: () => ({
  }),
  methods: {
    postYes() {
      this.$emit(`postAnswer`, `yes`);
    },
    postNo() {
      this.$emit(`postAnswer`, `no`);
    },
  },
  mounted() {
  },
});
</script>

<style scoped></style>
