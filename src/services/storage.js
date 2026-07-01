export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export function safeLoadState(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (err) {
    console.error(err.message);
    return fallback;
  }
}

export function restartLocalStorageGame() {
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
}
