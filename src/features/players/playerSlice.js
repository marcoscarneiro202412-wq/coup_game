import { createSlice } from "@reduxjs/toolkit";
import {
  generateCharacter,
  resolveBargain,
  resolveConfront,
  resolveCoup,
  resolveDeclare,
  resolveRitual,
} from "../../domain/gamesRules";
import { safeLoadState } from "../../services/storage";
import { resolveHelper } from "../../helpers/resolveHelper";

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
      return resolveHelper(resolveRitual(player), sta);
    },

    declareCharacter: {
      prepare(playerId, characterId, targetId = null) {
        return {
          payload: { playerId, characterId, targetId },
        };
      },

      reducer(sta, act) {
        return resolveHelper(
          resolveDeclare(
            sta.players,
            act.payload.playerId,
            act.payload.characterId,
            act.payload.targetId,
          ),
          sta,
        );
      },
    },

    confront: {
      prepare(confronterId, confrontedId) {
        return { payload: { confrontedId, confronterId } };
      },

      reducer(sta, act) {
        return resolveHelper(
          resolveConfront(
            sta.players,
            act.payload.confronterId,
            act.payload.confrontedId,
          ),
          sta,
        );
      },
    },

    coupDEtat: {
      prepare(playerId, enemyId) {
        return { payload: { playerId, enemyId } };
      },

      reducer(sta, act) {
        return resolveHelper(
          resolveCoup(sta.players, act.payload.playerId, act.payload.enemyId),
          sta,
        );
      },
    },

    bargain(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);
      return resolveHelper(resolveBargain(player), sta);
    },

    auxilio(sta, act) {
      const player = sta.players.find((p) => p.id === act.payload);

      if (!player) {
        sta.error = "Jogador não encontrado";
      }

      player.money += 2;
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
  killPlayer,
  cleanThePlayers,
  cleanTheError,
} = players.actions;

export default players.reducer;
