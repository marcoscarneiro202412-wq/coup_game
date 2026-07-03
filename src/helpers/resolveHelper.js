import { typeValidatorHelper } from "./typeValidatorHelper";

export function resolveHelper(resolved, state) {
  const { ok, error, changes } = resolved;

  if (!ok) {
    state.error = error;
    return;
  } else {
    changes.forEach((c) => {
      const playerIdx = state.players.findIndex((p) => p.id === c.playerId);
      const modifiedPlayer = typeValidatorHelper(c, state.players[playerIdx]);

      state.players[playerIdx] = modifiedPlayer;
    });
  }

  return state;
}
