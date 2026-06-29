import { createSlice } from "@reduxjs/toolkit";
import { characters } from "../../data/characters";
import { generateCharacter } from "../../domain/gamesRules";
import { ambassadorCharacterAction } from "../../domain/actions";

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

      const [character] = generateCharacter(1, player.characters);
      if (!character) {
        sta.error = "Character not generated";
        return;
      }

      sta.players[sta.players.indexOf(player)] = {
        ...player,
        characters: [...player.characters, character],
        money: player.money - 18,
        hp: player.hp + 1,
      };
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
          duke: () => (sta.players[playerIdx].money += 3),
          ambassadorCharacterAction: () =>
            (sta.players[playerIdx] = ambassadorCharacterAction(
              sta.players[playerIdx],
            )),
        };

        actions[act.payload.characterId]?.();
      },
    },

    confront: {
      prepare(confronterId, confrontedId) {
        return { payload: { confrontedId, confronterId } };
      },

      reducer(sta, act) {
        const confronterPlayer = sta.players.find(
          (p) => p.id === act.payload.confronterId,
        );
        const confrontedPlayer = sta.players.find(
          (p) => p.id === act.payload.confrontedId,
        );

        if (!confrontedPlayer || !confronterPlayer) return;

        if (confrontedPlayer.declaredCharacter.id !== undefined) return;
        if (
          confrontedPlayer.characters
            .map((c) => c.id)
            .includes(confrontedPlayer.declaredCharacter)
        ) {
          sta.players = sta.players.map((p) => {
            if (p.id === confrontedPlayer.id)
              return { ...p, money: p.money + confrontedPlayer.money };
            if (p.id === confronterPlayer.id) return { ...p, money: 0 };
            return p;
          });
        } else {
          sta.players = sta.players.map((p) => {
            if (p.id === confronterPlayer.id)
              return { ...p, money: p.money + confrontedPlayer.money };

            if (p.id === confrontedPlayer.id) return { ...p, money: 0 };

            return p;
          });
        }
      },
    },

    coupDEtat: {
      prepare(playerId, enemyId) {
        return { payload: { playerId, enemyId } };
      },

      reducer(sta, act) {
        const playerIdx = sta.players.findIndex(
          (p) => p.id === act.payload.playerId,
        );

        if (playerIdx === -1) return;

        if (sta.players.at(playerIdx).money < 7) return;
        const enemy = sta.players.findIndex(
          (p) => p.id === act.payload.enemyId,
        );

        sta.players.at(playerIdx).money -= 7;
        sta.players.at(enemy).hp -= 1;
        if (sta.players.at(enemy).hp <= 0) {
          sta.players.at(enemy).alive = false;
        }
        sta.players.at(enemy).characters.pop();
      },
    },

    bargain(sta, act) {
      const idx = sta.players.findIndex((p) => p.id === act.payload);
      if (sta.players.at(idx).money < 6) return;
      sta.players.at(idx).money -= 6;

      const charactersDisponibles = characters.slice();
      const newCharacters = [];

      for (let i = 0; i <= sta.players[idx].characters.length; i++) {
        const newIdx = Math.floor(Math.random() * charactersDisponibles.length);
        newCharacters.push(charactersDisponibles[newIdx]);
        charactersDisponibles.splice(newIdx, 1);
      }
      newCharacters.shift();
      sta.players.at(idx).characters = newCharacters;
    },

    auxilio(sta, act) {
      const idx = sta.players.findIndex((p) => p.id === act.payload);
      sta.players[idx].money += 2;
    },

    takeTheMoney: {
      prepare(playerId, amount) {
        return { payload: { playerId, amount } };
      },

      reducer(sta, act) {
        sta.players.at(
          sta.players.findIndex((p) => p.id === act.payload.playerId),
        ).money -= act.payload.amount;
      },
    },

    giveTheMoney: {
      prepare(playerId, amount) {
        return { payload: { playerId, amount } };
      },

      reducer(sta, act) {
        sta.players.at(
          sta.players.findIndex((p) => p.id === act.payload.playerId),
        ).money += act.payload.amount;
      },
    },

    removePlayer(sta, act) {
      sta.players = sta.players.filter((p) => p.id !== act.payload);
    },

    killPlayer(sta, act) {
      const idx = sta.players.findIndex((p) => p.id === act.payload);

      if (idx === -1) return;

      sta.players[idx].hp--;
      sta.players[idx].characters.pop();

      if (sta.players[idx].hp <= 0) {
        sta.players[idx].alive = false;
      }
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
} = players.actions;

export default players.reducer;
