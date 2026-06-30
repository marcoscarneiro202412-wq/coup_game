import { createListenerMiddleware } from "@reduxjs/toolkit";
import { finalizeGame } from "../features/game/gameSlice";

const hpListenerMiddleware = createListenerMiddleware();

hpListenerMiddleware.startListening({
  predicate: (_, prev, cur) => {
    const prevPlayers = prev.players.players;
    const curPlayers = cur.players.players;

    return curPlayers.some((player, index) => {
      const prevPlayer = prevPlayers[index];
      return prevPlayer && player.hp !== prevPlayer.hp;
    });
  },

  effect: async (_, listener) => {
    const state = listener.getState();

    await listener.delay(0);

    const playersAfter = state.players.players.filter(p => p.alive);

    if (playersAfter.length === 1) {
      listener.dispatch(finalizeGame(playersAfter[0]));
      return;
    }
  },
});

export default hpListenerMiddleware;
