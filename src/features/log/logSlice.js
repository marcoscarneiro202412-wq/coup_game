import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  log: [],
};

const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLog(sta, act) {
      sta.log.push({
        id: crypto.randomUUID(),
        ...act.payload,
      });
    },
    clearLog(sta) {
      sta.log = [];
    },
  },
});

export const { addLog, clearSlice } = logSlice.actions;
export default logSlice.reducer;
