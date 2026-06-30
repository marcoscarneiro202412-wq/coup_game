import { createListenerMiddleware } from "@reduxjs/toolkit";
import { finalizeGame } from "../features/game/gameSlice";
import { coupDEtat, killPlayer } from "../features/players/playerSlice";

const hpListenerMiddleware = createListenerMiddleware();

hpListenerMiddleware.startListening({
  predicate: (act, prev, cur) => {
    const prevPlayers = prev.players.players;
    const currPlayers = cur.players.players;

    return act.type === killPlayer.type || act.type === coupDEtat.type || currPlayers.some((player, index) => {
      const prevPlayer = prevPlayers[index];

      return prevPlayer && prevPlayer.alive !== player.alive;
    });
  },

  effect: async (_, listener) => {
    const state = listener.getState();
    const playersAfter = state.players.players.filter((p) => p.alive);

    if (playersAfter.length === 1) {
      listener.dispatch(finalizeGame(playersAfter[0]));
      return;
    }
  },
});

export default hpListenerMiddleware;
