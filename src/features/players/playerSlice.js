import { createSlice } from "@reduxjs/toolkit";
import { characters } from "../../data/characters";

const initialState = JSON.parse(localStorage.getItem("players")) ?? {
  players: [],
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
      let charactersSlice = characters.slice();

      sta.players = sta.players.map((p) => {
        console.log(Math.floor(Math.random() * characters.length));
        const character = charactersSlice.at(
          Math.floor(Math.random() * charactersSlice.length),
        );
        charactersSlice = charactersSlice.filter((c) => c.id !== character?.id);
        return {
          ...p,
          characters: [...p.characters, character],
          alive: true,
          hp: 1,
        };
      });

      console.log(sta.players);
    },
    giveALive(sta, act) {
      const playerIdx = sta.players.findIndex((p) => p.id === act.payload);
      if (sta.players.at(playerIdx).money < 18) return;
      const charactersFree = characters.filter(
        (c) =>
          !sta.players[playerIdx].characters.map((c) => c.id).includes(c.id),
      );
      const character = charactersFree.at(
        Math.floor(Math.random() * charactersFree.length),
      );
      if (!character) return;
      sta.players = sta.players.map((p, i) =>
        i === playerIdx
          ? {
              ...p,
              characters: [...p.characters, character],
              money: p.money - 18,
              hp: p.hp + 1,
            }
          : p,
      );
    },
    declareCharacter: {
      prepare(playerId, characterId) {
        return {
          payload: { playerId, characterId },
        };
      },

      reducer(sta, act) {
        const player = sta.players.findIndex(
          (p) => p.id === act.payload.playerId,
        );
        sta.players[player].declaredCharacter = act.payload.characterId;
        switch (act.payload.characterId) {
          case "duke":
            sta.players[player].money += 3;
            break;
          case "ambassador": {
            if (
              !sta.players[player].characters.some((c) => c.id === "ambassador")
            )
              return;
            const charactersDisponibles = characters.slice();
            const newCharacters = [];

            for (let i = 0; i < sta.players[player].characters.length; i++) {
              const newIdx = Math.floor(
                Math.random() * charactersDisponibles.length,
              );
              newCharacters.push(charactersDisponibles[newIdx]);
              charactersDisponibles.splice(newIdx, 1);
            }
            sta.players[player].characters = newCharacters;
            break;
          }
          default:
            return;
        }
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

        if(!confrontedPlayer || !confronterPlayer) return;

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
          console.log(confrontedPlayer.declaredCharacter);
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

        if(playerIdx === -1) return;

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
      console.log(sta.players);
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
