import { createListenerMiddleware } from "@reduxjs/toolkit";
import { removePlayer } from "../features/players/playerSlice";
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

    const playersBefore = state.players.players;

    const deadPlayer = playersBefore.find((p) => p.hp <= 0);

    if (!deadPlayer) return;

    listener.dispatch(removePlayer(deadPlayer.id));

    await listener.delay(0);

    const playersAfter = listener.getState().players.players;

    // fim de jogo
    if (playersAfter.length === 1) {
      listener.dispatch(finalizeGame(playersAfter[0].id));
      return;
    }
  },
});

export default hpListenerMiddleware;
