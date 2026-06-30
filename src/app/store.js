import { configureStore } from "@reduxjs/toolkit";
import playerReducer from "../features/players/playerSlice";
import gameReducer from "../features/game/gameSlice";
import turnReducer from "../features/game/turnSlice";
import hpListenerMiddleware from "../middleware/hpListenerMiddleware";
import nextTurnMiddleware from "../middleware/nextTurnMiddleware";
import authMiddleware from "../middleware/authMiddleware";
import authReducer from "../features/auth/authSlice";
import interceptMiddleware from "../middleware/interceptMiddleware";
import finalizeGameMiddleware from "../middleware/finalizeGameMiddleware";

const store = configureStore({
  reducer: {
    players: playerReducer,
    game: gameReducer,
    turn: turnReducer,
    auth: authReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      nextTurnMiddleware.middleware,
      authMiddleware.middleware,
      interceptMiddleware.middleware,
      finalizeGameMiddleware.middleware,
      hpListenerMiddleware.middleware
    ),
});

export default store;
