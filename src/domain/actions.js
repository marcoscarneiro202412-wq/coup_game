import { ASSASSIN_COST } from "../data/cost_characters";
import {
  giveTheMoney,
  killPlayer,
  takeTheMoney,
} from "../features/players/playerSlice";
import store from "../app/store";
import verify from "./verifyCharacter";
import { generateCharacter } from "./gamesRules";

const state = store.getState();
const dispatch = store.dispatch;

const assassinCharacterAction = (attackedPlayerId, playerId) => {
  {
    const { players } = state.players;
    dispatch(takeTheMoney(playerId, ASSASSIN_COST));
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
  }
};

const captainCharacterAction = (attackedPlayerId, player) => {
  const { players } = state.players;
  const playerTarget = players.find((p) => p.id === attackedPlayerId);

  const value = Math.min(playerTarget.money, 2);

  dispatch(takeTheMoney(playerTarget.id, value));
  dispatch(giveTheMoney(player.id, value));
};

const ambassadorCharacterAction = (player) => {
  if (verify("ambassador", 0, player)) return;

  const newCharacters = generateCharacter(player.characters.length);

  player.characters = newCharacters;

  return player;
};

export { assassinCharacterAction, captainCharacterAction, ambassadorCharacterAction };
