import { createListenerMiddleware } from "@reduxjs/toolkit";

const interceptMiddleware = createListenerMiddleware();

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

interceptMiddleware.startListening({
  predicate: () => true,
  effect: (_, listener) => {
    const { players, turn, auth, game } = listener.getState();
    setItem("players", players);
    setItem("turn", turn);
    setItem("auth", auth);
    setItem("game", game);
  },
});

export default interceptMiddleware;
