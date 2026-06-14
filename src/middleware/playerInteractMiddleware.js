import { createListenerMiddleware } from "@reduxjs/toolkit";
import { characters } from "../data/characters";
import {
  giveTheMoney,
  killPlayer,
  takeTheMoney,
} from "../features/players/playerSlice";
import { defineTurn } from "../features/game/turnSlice";

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
      case "assassin":
        if (
          player.money >= 3 &&
          player.characters.some((c) => c.id === "assassin")
        ) {
          listener.dispatch(takeTheMoney(player.id, 3));
          const target = prompt("Quem você quer matar? (Digite cada letra)");
          if(target === player.name) {console.log("deu um bagui");return;}
          const playerTarget = players.find((p) => p.name === target);
          if (!playerTarget.characters.some((c) => c.id === "contessa")) {
            listener.dispatch(killPlayer(playerTarget.id));
            if(playerTarget.hp <= 0) listener.dispatch(defineTurn(players.indexOf(player) + 1));
            alert(`Jogador ${playerTarget.name} foi eliminado com sucesso!`);
          } else {
            alert("A condessa bloqueia sua faca (e seu dinheiro também)");
          }
        } else {
          alert(
            "Declarado o assassino cujo custo ou personagem não tens, por isso, sua rodada será cancelada",
          );
        }
        break;
      case "captain": {
        const target = prompt("Quem você quer roubar? (Digite cada letra)");
        const playerTarget = players.find((p) => p.name === target);
        if (playerTarget && player.characters.some((c) => c.id === "captain")) {
          if(playerTarget.money >= 2) listener.dispatch(takeTheMoney(playerTarget.id, 2));
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
