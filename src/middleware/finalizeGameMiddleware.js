import { createListenerMiddleware } from "@reduxjs/toolkit";
import { defineUser } from "../features/auth/authSlice";
import { cleanThePlayers } from "../features/players/playerSlice";
import { restartLocalStorageGame } from "../helpers/restartLocalStorageGame";

const finalizeGameMiddleware = createListenerMiddleware();

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
    restartLocalStorageGame();
  },
});

export default finalizeGameMiddleware;
