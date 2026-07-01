import { setItem } from "./setItem";

export function restartLocalStorageGame() {
  setItem("players", { players: [] });
  setItem("turn", {
    currentTurn: 0,
    round: 1,
  });
  setItem("game", {
    status: "waiting",
    winner: null,
    gameStarted: false,
  });
}
