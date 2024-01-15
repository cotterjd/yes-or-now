<template>
  <Dialog :visible="addingName" :closable="true">
    <input-text
      placeholder="Player name"
      v-model="playerName"
      @keyup.enter="enterGame"
    />
    <Button label="Submit" @click="enterGame" />
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default defineComponent({
  name: `EnterGameDialog`,
  components: {
    Dialog,
    InputText,
    Button,
  },
  watch: {
    playerName(newVal) {
      this.$emit(`update:playerName`, newVal);
    },
  },
  methods: {
    enterGame() {
      this.$emit(`enterGame`);
    },
  },
});
</script>

<style scoped></style>
