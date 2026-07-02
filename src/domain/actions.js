import {
  resetCharacters,
} from "../features/players/playerSlice";
import verify from "./validation";
import { characters } from "../data/characters";

const assassinCharacterAction = (attackedPlayerId, playerId, players) => {
  const target = players.find((p) => p.id === attackedPlayerId);
  if (!target) {
    return { ok: false, error: "O alvo não existe!" };
  }

  if (!target.characters.some((c) => c.id === "contessa")) {
    return {
      ok: true,
      changes: [
        { type: "damage", playerId: attackedPlayerId, amount: 1 },
        {
          type: "money",
          playerId,
          amount: -characters.find((c) => c.id === "assassin").cost,
        },
      ],
    };
  } else {
    return { ok: false, error: "O alvo tem a condessa (bloqueia o assassino)" };
  }
};

const captainCharacterAction = (attackedPlayerId, player, players) => {
  const playerTarget = players.find((p) => p.id === attackedPlayerId);

  if (!playerTarget || !player) return { ok: false, error: "O capitão ou o alvo não existem" };

  const value = Math.min(playerTarget.money, 2);

  return {
    ok: true,
    changes: [
      { type: "money", playerId: player.id, amount: value },
      { type: "money", playerId: attackedPlayerId, amount: -value },
    ],
  };
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
