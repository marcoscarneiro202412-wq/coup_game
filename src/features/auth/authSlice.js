import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(
  localStorage.getItem("auth") ??
    JSON.stringify({
      isLoading: false,
      error: "",
      user: null,
      isAuthenticated: false,
    }),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    defineUser: {
      prepare(id, name, email, avatar, history = []) {
        return { payload: { id, name, email, avatar, history } };
      },
      reducer(sta, act) {
        sta.user = act.payload;
        sta.isAuthenticated = true;
        sta.isLoading = false;
        sta.error = "";
      },
    },
    login(sta) {
      return sta;
    },
    signup(sta) {
      return sta;
    },
    logout(sta) {
      sta.user = null;
      sta.isAuthenticated = false;
    },
    fetchingTheData(sta) {
      sta.error = "";
      sta.isLoading = true;
    },
    setError(sta, act) {
      sta.isLoading = false;
      sta.error = act.payload;
    },
    deleteHistory(sta) {
      sta.isLoading = false;
      return sta;
    },
    resetPage(sta) {
      sta.isLoading = false;
      sta.error = "";
    },
  },
});

export default authSlice.reducer;
export const {
  defineUser,
  logout,
  login,
  signup,
  fetchingTheData,
  setError,
  deleteHistory,
  resetPage,
} = authSlice.actions;
