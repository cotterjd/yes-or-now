<template>
  <menu-bar :model="menuItems" />
  <question />
  <answer @postAnswer="postAnswer" />
   
  <Dialog :visible="addingName" :closable="true">
   <input-text placeholder="Player name" v-model="playerName" @keyup.enter="enterGame" /> 
   <Button label="Submit" @click="enterGame" />
  </Dialog>

  <version />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import MenuBar from "primevue/menubar";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Answer from "./Answer.vue";
import Question from "./Question.vue";
 
export default defineComponent({
  components: {
    Answer,
    Question,
    MenuBar,
    Dialog,
    InputText,
    Button,
  },
  data: () => {
    return {
      socket: null,
      menuItems: [],
      playerName: '',
    };
  },
  computed: {
    ...mapState([`addingName`, `gameStarted`]),
  },
  watch: {
    gameStarted(newVal) {
      this.menuItems = [
        {
          label: this.gameStarted ? `End game` : `Start game`,
          command: () => this.$store.dispatch(`startStopGame`, this.socket),
        },
        {
          label: `Add statement`,
        },
      ]
    },
  },
  mounted() {
    this.socket = new WebSocket('ws://localhost:3000');
    this.socket.onmessage = (event) => {
      this.$store.commit(`updateState`, JSON.parse(event.data));
    };
    this.menuItems = [
      {
        label: this.gameStarted ? `End game` : `Start game`,
        command: () => this.$store.dispatch(`startStopGame`, this.socket),
      },
      {
        label: `Add statement`,
      },
    ]
  },
  methods: {
    enterGame() {
      this.$store.dispatch(`enterGame`, { socket: this.socket, player: this.playerName });
    },
    sendMessage(answer: string) {
      if (answer !== '') {
        // send message
      }
    },
  },
});
</script>

<style scoped></style>
