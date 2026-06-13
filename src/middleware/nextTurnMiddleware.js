import { createListenerMiddleware } from "@reduxjs/toolkit";
import { nextTurn } from "../features/game/turnSlice";

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
    listener.dispatch(nextTurn(players.players.length));
  },
});

export default nextTurnMiddleware;
