import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  defineUser,
  fetchingTheData,
  setError,
} from "../features/auth/authSlice";
import { cleanThePlayers } from "../features/players/playerSlice";
import { restartLocalStorageGame } from "../helpers/restartLocalStorageGame";
import { createHistory } from "../services/historyApi";

const finalizeGameMiddleware = createListenerMiddleware();

finalizeGameMiddleware.startListening({
  predicate: (act) => {
    return act.type.endsWith("finalizeGame");
  },

  effect: async (act, listener) => {
    const { players, turn, auth, game } = listener.getState();

    try {
      listener.dispatch(fetchingTheData());
      const user = await createHistory(
        auth.user.id,
        game.winner.name,
        turn.round,
        players.players
      );
      listener.dispatch(
        defineUser(
          user["_id"],
          user.name,
          user.email,
          user.avatar,
          user.history,
        ),
      );
    } catch (err) {
      console.error(err.message);
      listener.dispatch(setError(err.message));
    } finally {
      listener.dispatch(cleanThePlayers());
      restartLocalStorageGame();
    }
  },
});

export default finalizeGameMiddleware;
