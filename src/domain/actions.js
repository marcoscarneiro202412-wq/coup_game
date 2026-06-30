import {
  declareCharacter,
  giveTheMoney,
  killPlayer,
  resetCharacters,
  takeTheMoney,
} from "../features/players/playerSlice";
import verify from "./verifyCharacter";
import { characters } from "../data/characters";

const assassinCharacterAction = (
  attackedPlayerId,
  playerId,
  dispatch,
  players,
) => {
  dispatch(
    takeTheMoney(playerId, characters.find((c) => c.id === "assassin").cost),
  );
  const target = players.find((p) => p.id === attackedPlayerId);
  if (!target) {
    alert("O jogador que você digitou não existe! Passando turno");
    return;
  }
  if (!target.characters.some((c) => c.id === "contessa")) {
    dispatch(killPlayer(attackedPlayerId));
  } else {
    alert("A condessa bloqueia sua faca (e seu dinheiro também)");
  }
  dispatch(declareCharacter(playerId, "assassin"));
};

const captainCharacterAction = (
  attackedPlayerId,
  player,
  players,
  dispatch,
) => {
  const playerTarget = players.find((p) => p.id === attackedPlayerId);

  const value = Math.min(playerTarget.money, 2);

  dispatch(takeTheMoney(playerTarget.id, value));
  dispatch(giveTheMoney(player.id, value));
  dispatch(declareCharacter(player.id, "captain"));
};

const ambassadorCharacterAction = (dispatch, player) => {
  if (
    !verify(
      "ambassador",
      characters.find((c) => c.id === "ambassador").cost ?? 0,
      player,
    )
  ) {
    alert("Você não tem o ambassador ou não tem o custo dele");
  }
  dispatch(resetCharacters(player.id));
};

export {
  assassinCharacterAction,
  captainCharacterAction,
  ambassadorCharacterAction,
};
