import { createListenerMiddleware } from "@reduxjs/toolkit";
import { defineUser } from "../features/auth/authSlice";
import { cleanThePlayers } from "../features/players/playerSlice";

const finalizeGameMiddleware = createListenerMiddleware();
const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
finalizeGameMiddleware.startListening({
  predicate: (act) => {
    return act.type.endsWith("finalizeGame");
  },

  effect: async (act, listener) => {
    const { players, turn, auth } = listener.getState();
    const res = await fetch(
      "https://users-api-coup.onrender.com/history/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: auth.user["_id"] ?? auth.user.id,
          game: {
            winner: players.players.at(0).name,
            rounds: turn.round,
          },
        }),
      },
    );

    const user = await res.json();

    if (auth.user)
      listener.dispatch(
        defineUser(
          user["_id"],
          user.name,
          user.email,
          user.avatar,
          user.history,
        ),
      );
    listener.dispatch(cleanThePlayers());
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
  },
});

export default finalizeGameMiddleware;
