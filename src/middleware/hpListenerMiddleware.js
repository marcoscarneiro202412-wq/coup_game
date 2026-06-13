import { createListenerMiddleware } from "@reduxjs/toolkit";
import { removePlayer } from "../features/players/playerSlice";
import { finalizeGame } from "../features/game/gameSlice";
import { defineTurn } from "../features/game/turnSlice";

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
    const currentTurn = state.turn.currentTurn;

    const deadPlayer = playersBefore.find((p) => p.hp <= 0);

    if (!deadPlayer) return;

    const deadIndex = playersBefore.findIndex(
      (p) => p.id === deadPlayer.id,
    );

    listener.dispatch(removePlayer(deadPlayer.id));

    await listener.delay(0);

    const playersAfter = listener.getState().players.players;

    // fim de jogo
    if (playersAfter.length === 1) {
      listener.dispatch(finalizeGame(playersAfter[0].id));
      return;
    }

    // jogador removido antes do turno atual
    if (deadIndex < currentTurn) {
      listener.dispatch(
        defineTurn(Math.max(0, currentTurn - 1)),
      );
      return;
    }

    // turno ficou inválido após remoção
    if (currentTurn >= playersAfter.length) {
      listener.dispatch(defineTurn(0));
    }
  },
});

export default hpListenerMiddleware;