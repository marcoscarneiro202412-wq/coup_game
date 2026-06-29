import { characters } from "../data/characters";

function generateCharacter(quantity, existentCharacters = [], isBargain) {
  const freeCharacters = characters.filter(
    (c) => !existentCharacters.some((ec) => c.id === ec.id),
  );

  const isBargainPiece = isBargain ? [] : freeCharacters;

  const charactersPiece = [...freeCharacters, ...isBargainPiece];
  const charactersForSend = [];
  for (let i = 0; i < quantity; i++) {
    const character = charactersPiece.at(
      Math.floor(Math.random() * charactersPiece.length),
    );
    charactersForSend.push(character);
    const deletedCharacterIndex = charactersPiece.findIndex(
      (c) => c.name === character.name,
    );
    if (deletedCharacterIndex > -1) {
      charactersPiece.splice(deletedCharacterIndex, 1);
    }
  }
  return charactersForSend;
}

export { generateCharacter };
