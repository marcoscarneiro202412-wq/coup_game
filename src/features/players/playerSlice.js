import { createSlice } from "@reduxjs/toolkit";
import { generateCharacter } from "../../domain/gamesRules";
// import { ambassadorCharacterAction } from "../../domain/actions";

const initialState = JSON.parse(localStorage.getItem("players")) ?? {
  players: [],
  error: "",
};

const players = createSlice({
  name: "players",
  initialState,
  reducers: {
    cleanThePlayers(sta) {
      sta.players = [];
    },
    createPlayer: {
      prepare(name, imgUrl) {
        return { payload: { name, imgUrl } };
      },

      reducer(state, action) {
        if (!action.payload.name) {
          state.error = "The created player doesn't have a name";
          return;
        }

        state.players = [
          ...state.players,
          {
            id: state.players.length + 1,
            name: action.payload.name,
            imgUrl: action.payload.imgUrl
              ? action.payload.imgUrl
              : "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
            money: 0,
            hp: 0,
            characters: [],
          },
        ];
      },
    },

    generateCharacterForPlayers(sta) {
      const characters = generateCharacter(sta.players.length);
      sta.players = sta.players.map((p, i) => {
        return {
          ...p,
          characters: [characters[i]],
          alive: true,
          hp: 1,
        };
      });
    },

    giveALive(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);

      if (!player) {
        sta.error = "Player not found";
        return;
      }

      if (player.money < 18) return;

      players.caseReducers.takeTheMoney(
        sta,
        players.actions.takeTheMoney(act.payload.playerId, 18),
      );

      const [character] = generateCharacter(1, player.characters);
      if (!character) {
        sta.error = "Character not generated";
        return;
      }

      player.characters = [...player.characters, character];
    },

    declareCharacter: {
      prepare(playerId, characterId) {
        return {
          payload: { playerId, characterId },
        };
      },

      reducer(sta, act) {
        const playerIdx = sta.players.findIndex(
          (p) => p.id === act.payload.playerId,
        );

        sta.players[playerIdx].declaredCharacter = act.payload.characterId;

        const actions = {
          duke: () =>
            players.caseReducers.giveTheMoney(
              sta,
              players.actions.giveTheMoney(act.payload.playerId, 3),
            ),
          ambassador: () =>
            players.caseReducers.resetCharacters(
              sta,
              players.actions.resetCharacters(act.payload.playerId),
            ),
        };

        actions[act.payload.characterId]?.();
      },
    },

    confront: {
      prepare(confronterId, confrontedId) {
        return { payload: { confrontedId, confronterId } };
      },

      reducer(sta, act) {
        const confronter = sta.players.find(
          (p) => p.id === act.payload.confronterId,
        );
        const confronted = sta.players.find(
          (p) => p.id === act.payload.confrontedId,
        );

        if (!confronted || !confronter) {
          sta.error = "Algum dos jogadores não existe";
          return;
        }

        if (!confronted.declaredCharacter) {
          sta.error = "O jogador confrontado não declarou personagem";
          return;
        }

        const confrontIsTrue = confronted.characters.some(
          (c) => c.id === confronted.declaredCharacter,
        );

        if (confrontIsTrue) {
          const amount = Math.floor(confronter.money / 2);

          confronter.money = amount;
          confronted.money += Math.floor(amount / 1.5);
        } else {
          const amount = Math.floor(confronted.money / 2);

          confronter.money += Math.floor(amount / 1.5);
          confronted.money = amount;

          confronted.declaredCharacter = null;
        }
      },
    },

    coupDEtat: {
      prepare(playerId, enemyId) {
        return { payload: { playerId, enemyId } };
      },

      reducer(sta, act) {
        const player = sta.players.find((p) => p.id === act.payload.playerId);

        if (!player) {
          sta.error = "Jogador não encontrado";
          return;
        }

        if (player.money < 7) {
          sta.error = "Jogador não tem dinheiro para realizar essa ação";
          return;
        }

        players.caseReducers.killPlayer(sta, {
          action: "players/killPlayer",
          payload: act.payload.enemyId,
        });
      },
    },

    bargain(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);
      if (player.money < 6) return;

      players.caseReducers.takeTheMoney(
        sta,
        players.actions.takeTheMoney(player.id, 6),
      );

      players.caseReducers.resetCharacters(sta, act);
    },

    auxilio(sta, act) {
      players.caseReducers.giveTheMoney(
        sta,
        players.actions.giveTheMoney(act.payload, 2),
      );
    },

    takeTheMoney: {
      prepare(playerId, amount) {
        return { payload: { playerId, amount } };
      },

      reducer(sta, act) {
        const player = sta.players.find((p) => p.id === act.payload.playerId);
        player.money -= Math.min(act.payload.amount, player.money);
      },
    },

    giveTheMoney: {
      prepare(playerId, amount) {
        return { payload: { playerId, amount } };
      },

      reducer(sta, act) {
        const player = sta.players.find((p) => p.id === act.payload.playerId);
        player.money += act.payload.amount;
      },
    },

    removePlayer(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);
      player.alive = false;
    },

    killPlayer(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);

      if (!player) {
        sta.error = "Jogador não encontrado";
        return;
      }

      player.hp--;
      if (player.characters) player.characters.pop();
    },

    resetCharacters(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);
      player.characters = generateCharacter(
        player.characters.length,
        player.characters,
      );
    },

    cleanTheError(sta) {
      sta.error = "";
    },
  },
});

export const {
  createPlayer,
  generateCharacterForPlayers,
  giveALive,
  declareCharacter,
  confront,
  coupDEtat,
  bargain,
  auxilio,
  takeTheMoney,
  giveTheMoney,
  killPlayer,
  removePlayer,
  cleanThePlayers,
  cleanTheError,
  resetCharacters,
} = players.actions;

export default players.reducer;
