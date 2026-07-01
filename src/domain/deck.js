import { characters } from "../data/characters";

export const createDeck = (existentCharacters, isBargain) => {
  const freeCharacters = characters.filter(
    (c) => !existentCharacters.some((ec) => c.id === ec.id),
  );

  const isBargainPiece = isBargain ? [] : freeCharacters;

  return [...freeCharacters, ...isBargainPiece];
};
