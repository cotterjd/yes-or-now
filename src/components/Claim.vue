<template>
  <h1>{{ game.statement }}</h1>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: `Claim`,
  props: {
    getClaim: {
      type: Function,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapState([`game`, `playerName`]),
  },
  mounted() {
    if (this.game.gameStarted && this.game.playerTurn === this.playerName && !this.game.statement) {
      this.getClaim();
    }
  },
});
</script>

<style scoped></style>
