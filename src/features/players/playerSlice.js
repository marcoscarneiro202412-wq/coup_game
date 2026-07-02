import { createSlice } from "@reduxjs/toolkit";
import {
  generateCharacter,
  resolveConfront,
  resolveCoup,
  resolveDeclare,
} from "../../domain/gamesRules";
import { safeLoadState } from "../../services/storage";
import { typeValidatorHelper } from "../../helpers/typeValidatorHelper";

const initialState = safeLoadState("players", {
  players: [],
  error: "",
});

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
            id: crypto.randomUUID(),
            name: action.payload.name,
            imgUrl: action.payload.imgUrl
              ? action.payload.imgUrl
              : "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
            money: 180,
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
        players.actions.takeTheMoney(act.payload, 18),
      );

      const [character] = generateCharacter(1, player.characters);
      if (!character) {
        sta.error = "Character not generated";
        return;
      }
      player.hp++;
      player.characters = [...player.characters, character];
    },

    declareCharacter: {
      prepare(playerId, characterId, targetId = null) {
        return {
          payload: { playerId, characterId, targetId },
        };
      },

      reducer(sta, act) {
        const { ok, error, changes } = resolveDeclare(
          sta.players,
          act.payload.playerId,
          act.payload.characterId,
          act.payload.targetId,
        );

        if (!ok) {
          sta.error = error;
          return;
        } else {
          changes.forEach((c) => {
            console.log(c)
            const playerIdx = sta.players.findIndex((p) => p.id === c.playerId);
            const modifiedPlayer = typeValidatorHelper(
              c,
              sta.players[playerIdx],
            );

            sta.players[playerIdx] = modifiedPlayer;
          });
        }
      },
    },

    confront: {
      prepare(confronterId, confrontedId) {
        return { payload: { confrontedId, confronterId } };
      },

      reducer(sta, act) {
        const { ok, error, changes } = resolveConfront(
          sta.players,
          act.payload.confronterId,
          act.payload.confrontedId,
        );

        if (!ok) {
          sta.error = error;
          return;
        } else {
          changes.forEach((c) => {
            const playerIdx = sta.players.findIndex((p) => p.id === c.playerId);
            const modifiedPlayer = typeValidatorHelper(
              c,
              sta.players[playerIdx],
            );

            sta.players[playerIdx] = modifiedPlayer;
          });
        }
      },
    },

    coupDEtat: {
      prepare(playerId, enemyId) {
        return { payload: { playerId, enemyId } };
      },

      reducer(sta, act) {
        const { ok, error, changes } = resolveCoup(
          sta.players,
          act.payload.playerId,
          act.payload.enemyId,
        );

        if (!ok) {
          sta.error = error;
          return;
        } else {
          changes.forEach((c) => {
            const playerIdx = sta.players.findIndex((p) => p.id === c.playerId);
            const modifiedPlayer = typeValidatorHelper(
              c,
              sta.players[playerIdx],
            );

            sta.players[playerIdx] = modifiedPlayer;
          });
        }
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

    killPlayer: {
      prepare(targetId, lifes = 1) {
        return {
          payload: {
            targetId,
            lifes,
          },
        };
      },
      reducer(sta, act) {
        const player = sta.players.find((p) => p.id === act.payload.targetId);

        if (!player) {
          sta.error = "Jogador não encontrado";
          return;
        }

        player.hp -= act.payload.lifes;
        if (player.characters?.length === 0) player.characters.pop();

        if (player.hp <= 0) {
          player.alive = false;
        }
      },
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
  cleanThePlayers,
  cleanTheError,
} = players.actions;

export default players.reducer;
