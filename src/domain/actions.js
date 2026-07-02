import verify from "./validation";
import { characters } from "../data/characters";

const assassinCharacterAction = (attackedPlayerId, playerId, players) => {
  const target = players.find((p) => p.id === attackedPlayerId);
  const actor = players.find(p => p.id === playerId);
  if (!target || !actor) 
    return { ok: false, error: "O alvo ou o jogador não existe!" };

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
  } else return { ok: false, error: "O alvo tem a condessa (bloqueia o assassino)" };
  
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

const ambassadorCharacterAction = (player) => {
  console.log(player.id, player.money, player.characters)
  const ambassadorCost = characters.find((c) => c.id === "ambassador").cost;
  if (
    !verify(
      "ambassador",
      ambassadorCost ?? 0,
      player,
    )
  ) return {ok: false, error: "Você não tem o ambassador!"}
  return {ok: true, changes: [
    {type: "money", playerId: player.id, amount: -ambassadorCost},
    {type: "resetCharacters", playerId: player.id}
  ]}
};

export {
  assassinCharacterAction,
  captainCharacterAction,
  ambassadorCharacterAction,
};
