import {
  ambassadorCharacterAction,
  assassinCharacterAction,
  captainCharacterAction,
} from "./actions";
import { createDeck } from "./deck";
import { canCoup } from "./validation";

function generateCharacter(quantity, existentCharacters = [], isBargain) {
  const deck = createDeck(existentCharacters, isBargain);

  const charactersForSend = [];

  for (let i = 0; i < quantity; i++) {
    const character = deck.at(Math.floor(Math.random() * deck.length));
    charactersForSend.push(character);
    const deletedCharacterIndex = deck.findIndex(
      (c) => c.name === character.name,
    );
    if (deletedCharacterIndex > -1) {
      deck.splice(deletedCharacterIndex, 1);
    }
  }

  return charactersForSend;
}

function resolveCoup(players, actorId, targetId) {
  const actor = players.find((p) => p.id === actorId);
  const target = players.find((p) => p.id === targetId);

  if (!actor) return { ok: false, error: "Ator não encontrado." };
  if (!target) return { ok: false, error: "Alvo não encontrado." };
  if (actor.id === target.id)
    return {
      ok: false,
      error: "Não é possível selecionar a si mesmo como alvo.",
    };
  if (!canCoup(actor))
    return { ok: false, error: "Não é possível realizar o golpe" };

  return {
    ok: true,
    changes: [
      { type: "money", playerId: actorId, amount: -7 },
      { type: "damage", playerId: targetId, amount: 1 },
    ],
  };
}

function resolveConfront(players, actorId, targetId) {
  const confronter = players.find((p) => p.id === actorId);
  const confronted = players.find((p) => p.id === targetId);

  if (!confronted || !confronter) {
    return { ok: false, error: "Algum dos jogadores não existe" };
  }

  if (!confronted.declaredCharacter) {
    return {
      ok: false,
      error: "O jogador confrontado não declarou nenhum personagem",
    };
  }

  const confrontIsFalse = confronted.characters.some(
    (c) => c.id === confronted.declaredCharacter,
  );

  const amount = Math.floor(confronter.money / 3);
  const moneyChanges = [
    {
      type: "money",
      playerId: actorId,
      amount: !confrontIsFalse ? Math.floor(amount / 1.5) : -amount,
    },
    {
      type: "money",
      playerId: targetId,
      amount: confrontIsFalse ? Math.floor(amount / 1.5) : -amount,
    },
  ];

  return {
    ok: true,
    changes: !confrontIsFalse
      ? [
          ...moneyChanges,
          { type: "clearDeclaredCharacter", playerId: targetId },
        ]
      : moneyChanges,
  };
}

const resolveDeclare = (players, actorId, characterId, targetId) => {
  const player = players.find((p) => p.id === actorId);

  const actions = {
    duke: () => ({
      ok: true,
      changes: { type: "money", playerId: actorId, amount: 3 },
    }),
    ambassador: () => ambassadorCharacterAction(player),
    assassin: () => assassinCharacterAction(targetId, player.id, players),
    captain: () => captainCharacterAction(targetId, player, players),
  };
  console.log(characterId);
  const actionFn = actions[characterId];

  const { ok, changes, error } = actionFn();
  console.log(error)
  return ok
    ? {
        ok: true,
        changes: [
          {
            type: "defineDeclareCharacter",
            playerId: actorId,
            character: characterId,
          },
          ...changes,
        ],
      }
    : { ok: false, error };
};

export { generateCharacter, resolveCoup, resolveConfront, resolveDeclare };
