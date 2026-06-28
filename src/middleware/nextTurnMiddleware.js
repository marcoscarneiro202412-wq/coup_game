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
    console.log(act.type.split("/").at(1))
    console.log(actionsForNextTurn.includes(act.type.split("/").at(1)))
    return actionsForNextTurn.includes(act.type.split("/").at(1));
  },
  effect: (_, listener) => {
    const { players, turn } = listener.getState();
    let idx = turn.currentTurn + 1;
    console.log(idx)
    if (idx >= players.players.length) idx = 0;
    console.log(idx)
    listener.dispatch(defineTurn(idx));
  },
});

export default nextTurnMiddleware;
