import { generateCharacter } from "../domain/gamesRules";
import { killPlayer } from "../features/players/playerSlice";

type changeType = {
  type: string;
  ok: boolean;
  amount: number;
  character: string;
};

type characterType = {
  id: string;
  attackOtherPlayer: boolean;
  name: string;
  action: string;
  cost: number;
  description: string;
};

type playerType = {
  id: string;
  name: string;
  imgUrl: string;
  money: number;
  hp: number;
  alive: boolean;
  declaredCharacter: string | null;
  characters: characterType[];
};

export function typeValidatorHelper(change: changeType, player: playerType) {
  switch (change.type) {
    case "money":
      player.money += change.amount;
      break;
    case "damage":
      const removedLives = Math.min(change.amount, player.hp);
      player.hp -= removedLives;

      player.characters = player.characters.slice(0, -removedLives);

      if (player.hp <= 0) {
        player.alive = false;
      }
      break;
    case "clearDeclaredCharacter":
      player.declaredCharacter = null;
      break;
    case "defineDeclareCharacter":
      player.declaredCharacter = change.character;
      break;
    case "resetCharacters":
      console.log(player.characters)
      const generated = generateCharacter(
        player.characters.length,
        player.characters,
        true
      );

      if (generated) {
        player.characters = generated
          .filter((c): c is characterType => c !== undefined)
          .map((c) => ({ ...c, action: c.action ?? "" }));
      } else {
        player.characters = player.characters;
      }
    default:
      console.error("Tipo não encontrado");
      break;
  }
  return player;
}
