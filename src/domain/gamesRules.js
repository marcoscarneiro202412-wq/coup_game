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
  if (!canCoup(actor)) return { ok: false, error: "Não é possível realizar o golpe" };

  return {
    ok: true,
    changes: [
      { type: "money", playerId: actorId, amount: -7 },
      { type: "damage", playerId: targetId, amount: 1 },
    ],
  };
}

export { generateCharacter, resolveCoup };
