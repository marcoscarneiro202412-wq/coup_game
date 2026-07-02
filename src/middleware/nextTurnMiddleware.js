import { createListenerMiddleware } from "@reduxjs/toolkit";
import { nextTurn } from "../features/game/turnSlice";
import { cleanTheError } from "../features/players/playerSlice";

let howManyTimeAreErrors = 0;

const nextTurnMiddleware = createListenerMiddleware();

nextTurnMiddleware.startListening({
  predicate: (act) => {
    const actionsForNextTurn = [
      "giveALive",
      "declareCharacter",
      "coupDEtat",
      "auxilio",
      "bargain",
    ];
    return actionsForNextTurn.includes(act.type.split("/").at(1));
  },
  effect: (_, listener) => {
    const { players } = listener.getState();

    if (players.error) {
      if (howManyTimeAreErrors >= 1) {
        listener.dispatch(cleanTheError());
        howManyTimeAreErrors = 0;
      }
      howManyTimeAreErrors++;
    } else {
      listener.dispatch(nextTurn(players.players));
    }
  },
});

export default nextTurnMiddleware;
