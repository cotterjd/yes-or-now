<template>
  <menu-bar :model="menuItems" />

  <div v-if="game.gameStarted && playerName">
    <div v-show="game.playerTurn">{{ game.playerTurn }}'s turn</div>

    <Claim :getClaim="getClaim" />

    <div v-show="game.statement && playerName">
      <Response @postResponse="postResponse" @next="next" />
    </div>

    <h2>Responses</h2>
    <p
      v-for="player in game.players.filter((p) => p.name !== playerTurn)"
      :key="player.name"
    >
      {{ player.name }}: {{ player.response }}
    </p>
    <Button class="next-button" @click="next">Next</Button>
  </div>

  <div v-else>
    <Button @click="addingName = true">Start or enter game</Button>
  </div>

  <!-- TODO: make auto focus -->
  <Dialog header="Input Name" v-model:visible="addingName">
    <InputText
      placeholder="Player name"
      v-model="playerNameInput"
      @keyup.enter="enterGame"
    />
    <Button label="Submit" @click="enterGame" />
  </Dialog>

  <Version />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import MenuBar from "primevue/menubar";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Response from "./Response.vue";
import Claim from "./Claim.vue";
import Version from "./Version.vue";

export default defineComponent({
  components: {
    Response,
    Claim,
    MenuBar,
    Dialog,
    InputText,
    Button,
    Version,
  },
  data: () => {
    return {
      socket: null,
      playerNameInput: "",
      menuItems: [],
      addingName: false,
    };
  },
  computed: {
    ...mapState([`game`, `playerName`]),
  },
  watch: {
    game(newVal) {
      this.menuItems = [
        {
          label: newVal.gameStarted ? `Leave game` : `Enter game`,
          command: () => {
            if (newVal.gameStarted) {
              this.$store.dispatch(`leaveGame`, this.socket);
            } else {
              this.$store.dispatch(`showNameModal`, {
                socket: this.socket,
                player: this.playerName,
              });
            }
          },
        },
        {
          label: `Add statement`,
        },
      ];
    },
  },
  mounted() {
    this.socket = new WebSocket(process.env.VUE_APP_WS_URL);
    this.socket.onmessage = (event) => {
      console.log(event.data);
      this.$store.commit(`updateGame`, JSON.parse(event.data));
    };
    // todo clean this up
    const label = this.game.gameStarted ? `Leave game` : `Enter game`;
    this.menuItems = [
      {
        label,
        command: () => {
          if (label === `Leave game`) {
            this.$store.dispatch(`leaveGame`, this.socket);
          } else {
            this.addingName = true;
          }
        },
      },
      {
        label: `Add statement`,
      },
    ];
    // const gameState = JSON.parse(localStorage.getItem(`vuex`)).game;
  },
  methods: {
    enterGame() {
      this.$store.dispatch(`enterGame`, {
        socket: this.socket,
        player: this.playerNameInput,
      });
      this.addingName = false;
    },
    getClaim() {
      this.$store.dispatch(`getClaim`, this.socket);
    },
    postResponse(response: string) {
      this.$store.dispatch(`postResponse`, {
        socket: this.socket,
        response,
        player: this.playerName,
      });
    },
    next(response: string) {
      this.$store.dispatch(`nextTurn`, this.socket);
      this.$store.dispatch(`getClaim`, this.socket);
    },
  },
});
</script>

<style scoped>
div {
  margin: 10px;
}
.next-button {
  background-color: #2196f3;
  margin-top: 20px;
}
</style>
