import { createListenerMiddleware } from "@reduxjs/toolkit";
import { characters } from "../data/characters";
import {
  giveTheMoney,
  takeTheMoney,
} from "../features/players/playerSlice";

const playerInteractMiddleware = createListenerMiddleware();

playerInteractMiddleware.startListening({
  predicate(act) {
    const character = characters.find((c) => c.id === act.payload?.characterId);
    return (
      (character?.attackOtherPlayer ?? false) &&
      act.type === "players/declareCharacter"
    );
  },
  effect: (act, listener) => {
    const character = characters.find((c) => c.id === act.payload.characterId);
    const players = listener.getState().players.players;
    const player = players.find((p) => act.payload.playerId === p.id);
    console.log(character, players, player);
    switch (character.id) {

      case "captain": {
        const target = prompt("Quem você quer roubar? (Digite cada letra)");
        const playerTarget = players.find((p) => p.name === target);
        if (playerTarget && player.characters.some((c) => c.id === "captain")) {
          if (playerTarget.money >= 2)
            listener.dispatch(takeTheMoney(playerTarget.id, 2));
          listener.dispatch(giveTheMoney(player.id, 2));
        } else {
          alert(
            "Você não tem o capitão ou o Jogador passado não existe passando para o próximo Jogador!",
          );
        }
        break;
      }
    }
  },
});

export default playerInteractMiddleware;
