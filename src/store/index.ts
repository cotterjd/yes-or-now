import Vue from "vue";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

interface Player {
  name: string;
  response: string;
}

interface GameState {
  gameStarted: boolean;
  playerTurn: string;
  players: Player[];
  statement: string;
  remainingStatements: string[];
  viewedStatements: string[];
}

interface State {
  playerName: string;
  game: GameState;
}
const defaultState: State = {
  playerName: ``,
  game: {
    gameStarted: false,
    playerTurn: "",
    players: [],
    statement: "",
    remainingStatements: [
      `Bigfoot is real`,
      `The Earth is flat`,
      `Aliens are real`,
    ],
    viewedStatements: [],
  },
};

const store = createStore({
  state: defaultState,
  getters: {},
  mutations: {
    updateState(state, newState) {
      Object.assign(state, newState);
    },
    updateGame(state, newState) {
      Object.assign(state.game, newState);
    },
    updateStatements(state, statements) {
      const allStatements = new Set([
        ...state.game.remainingStatements,
        ...statements,
      ]);
      Object.assign(state.game.remainingStatements, Array.from(allStatements));
    },
  },
  actions: {
    enterGame({ commit, state }, data) {
      console.log(state.game);
      const newState: Partial<State> = {
        game: {
          ...state.game,
          players: [
            ...state.game.players.filter((p) => p.name !== data.player),
            { name: data.player, response: `` },
          ],
          gameStarted: true,
          playerTurn: state.game.players.length
            ? state.game.playerTurn
            : data.player,
        },
        playerName: data.player,
      };
      sendGameState(data.socket, newState.game);
      commit("updateState", newState);
    },
    getClaim({ commit, state }, socket) {
      if (!state.game.remainingStatements.length) {
        const statement = `Game over.`;
        const gameState = {
          statement,
          remainingStatements: state.game.viewedStatements,
          viewedStatements: [],
        };
        commit("updateGame", gameState);
        sendGameState(socket, gameState);
        return;
      }
      const statement =
        state.game.remainingStatements[
          getRandomIndex(state.game.remainingStatements.length)
        ];
      const gameState = {
        statement,
        remainingStatements: state.game.remainingStatements.filter(
          (s) => s !== statement
        ),
        viewedStatements: [...state.game.viewedStatements, statement],
      };
      sendGameState(socket, gameState);
      commit("updateGame", gameState);
    },
    leaveGame({ commit, state }, socket) {
      const newState = {
        game: {
          ...state.game,
          players: state.game.players.filter(
            (p) => p.name !== state.playerName
          ),
        },
        playerName: ``,
      };
      sendGameState(socket, newState.game);
      commit("updateState", newState);
    },
    postResponse({ commit, state }, data) {
      const newGameState: Partial<GameState> = {
        ...state.game,
        players: state.game.players.map((p) =>
          p.name === data.player ? { ...p, response: data.response } : p
        ),
        // playerTurn:
        //   state.game.players[
        //     (state.game.players.findIndex(
        //       (p) => p.name === state.game.playerTurn
        //     ) +
        //       1) %
        //       state.game.players.length
        //   ].name,
      };
      sendGameState(data.socket, newGameState);
      commit("updateGame", newGameState);
    },
    nextTurn({ commit, state }, socket) {
      const newGameState: Partial<GameState> = {
        ...state.game,
        playerTurn:
          state.game.players[
            (state.game.players.findIndex(
              (p) => p.name === state.game.playerTurn
            ) +
              1) %
              state.game.players.length
          ].name,
        players: state.game.players.map((p) => ({ ...p, response: `` })),
      };
      sendGameState(socket, newGameState);
      commit("updateGame", newGameState);
    },
    submitStatement({ commit, state }, data) {
      const newGameState: Partial<GameState> = {
        ...state.game,
        remainingStatements: [
          ...state.game.remainingStatements,
          data.statement,
        ],
      };
      sendGameState(data.socket, newGameState);
      commit("updateGame", newGameState);
    },
  },
  modules: {},
  plugins: [createPersistedState()],
});

function sendGameState(socket, gameState) {
  socket.send(JSON.stringify(gameState));
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

export default store;
