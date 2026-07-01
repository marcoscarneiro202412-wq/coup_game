import { createSlice } from "@reduxjs/toolkit";
import { nextTurnEngine } from "../../domain/turnEngine";
import { safeLoadState } from "../../helpers/safeLoadState";

const initialState = safeLoadState("turn", {
  currentTurn: 0,
  round: 1,
});

const turnSlice = createSlice({
  name: "turn",
  initialState,
  reducers: {
    restartState(sta) {
      sta.currentTurn = 0;
      sta.round = 1;
    },
    nextTurn(sta, act) {
      const res = nextTurnEngine(act.payload, sta.currentTurn, sta.round);

      console.log(res);

      sta.currentTurn = res.currentTurn;
      sta.round = res.round;
    },

    defineTurn(sta, act) {
      sta.currentTurn = act.payload;
    },
  },
});

export default turnSlice.reducer;
export const { nextTurn, defineTurn, restartState } = turnSlice.actions;
