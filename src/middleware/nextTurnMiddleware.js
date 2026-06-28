import { createListenerMiddleware } from "@reduxjs/toolkit";
import { defineTurn } from "../features/game/turnSlice";

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
    const { players, turn } = listener.getState();
    let idx = turn.currentTurn + 1;
    if (idx >= players.players.length) idx = 0;
    listener.dispatch(defineTurn(idx));
  },
});

export default nextTurnMiddleware;
