import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addLog } from "../features/log/logSlice";
import { logCreator } from "../domain/logCreator";

const interceptMiddleware = createListenerMiddleware();

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

interceptMiddleware.startListening({
  predicate: () => true,
  effect: (act, listener) => {
    const { players, turn, auth, game } = listener.getState();
    setItem("players", players);
    setItem("turn", turn);
    setItem("auth", auth);
    setItem("game", game);

    if (!act.type.includes("auth") && !act.type.includes("log")) {
      const res = logCreator(act.type.split("/")[1], act.payload, players.players);
      console.log(res);
      if (res) {
        listener.dispatch(
          addLog({
            round: turn.round,
            turn: turn.currentTurn,
            ...res,
          }),
        );
      }
    }
  },
});

export default interceptMiddleware;
