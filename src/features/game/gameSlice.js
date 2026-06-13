import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("game") ?? JSON.stringify({
  status: "waiting",
  winner: null,
  gameStarted: false,
}));

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame(sta) {
      ((sta.status = "started"), (sta.gameStarted = true));
    },
    finalizeGame(sta, act) {
      sta.status = "waiting";
      sta.gameStarted = false;
      sta.winner = act.payload;
    },
  },
});

export default gameSlice.reducer;
export const { startGame, finalizeGame } = gameSlice.actions;
