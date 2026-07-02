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
  characters: object[];
};

export function typeValidatorHelper(
  change: changeType,
  player: playerType,
) {
  switch (change.type) {
    case "money":
      player.money += change.amount;
      break;
    case "damage":
      player.hp--;

      if (player.hp <= 0) {
        player.alive = false;
      }

      break;
    default:
      console.error("Tipo não encontrado");
  }
  return player;
}
