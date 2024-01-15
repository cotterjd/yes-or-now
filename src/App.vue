<template>
  <Home />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Home from "./components/PageHome.vue";
// import "primevue/resources/themes/lara-dark-purple/theme.css"
import "primevue/resources/themes/vela-green/theme.css";

export default defineComponent({
  name: `App`,
  components: {
    Home,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
