import { createDeck } from "./deck";

function generateCharacter(quantity, existentCharacters = [], isBargain) {

  const deck = createDeck(existentCharacters, isBargain);

  const charactersForSend = [];

  for (let i = 0; i < quantity; i++) {
    const character = deck.at(
      Math.floor(Math.random() * deck.length),
    );
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

export { generateCharacter };
