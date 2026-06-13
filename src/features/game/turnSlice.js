import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("turn") ?? JSON.stringify({
  currentTurn: 0,
  round: 1,
}));

const turnSlice = createSlice({
  name: "turn",
  initialState,
  reducers: {
    restartState(sta) {
      sta.currentTurn = 0;
      sta.round = 1;
    },
    nextTurn(sta, act) {
      sta.currentTurn++;

      if (sta.currentTurn >= act.payload) {
        sta.currentTurn = 0;
        sta.round++;
      }
    },

    defineTurn(sta, act) {
      sta.currentTurn = act.payload;
    },
  },
});

export default turnSlice.reducer;
export const { nextTurn, defineTurn, restartState } = turnSlice.actions;
