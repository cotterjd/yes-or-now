<template>
  <p>Version: {{ version }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: `Version`,
  data: () => ({
    version: require(`../../package.json`).version,
  }),
});
</script>

<style scoped>
</style>
