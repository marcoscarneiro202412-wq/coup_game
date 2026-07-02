import { killPlayer } from "../features/players/playerSlice";

type changeType = {
  type: string;
  ok: boolean;
  amount: number;
};

type playerType = {
  id: string;
  name: string;
  imgUrl: string;
  money: number;
  hp: number;
  alive: boolean;
  declaredCharacter: string | null;
  characters: object[];
};

export function typeValidatorHelper(change: changeType, player: playerType) {
  console.log(change);
  switch (change.type) {
    case "money":
      player.money += change.amount;
      break;
    case "damage":
      player.hp -= change.amount;

      if (player.hp <= 0) {
        player.alive = false;
      }
      break;
    case "clearDeclaredCharacter":
      player.declaredCharacter = null;
      break;
    default:
      console.error("Tipo não encontrado");
      break;
  }
  return player;
}
