import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  defineUser,
  fetchingTheData,
  setError,
} from "../features/auth/authSlice";

import { login, signup } from "../services/authApi";
import { deleteHistory } from "../services/historyApi";

const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  predicate(act) {
    return act.type.startsWith("auth");
  },

  effect: async (act, listener) => {
    const type = act.type.split("/")[1];
    const loginMiddleware = async (user, pass) => {
      listener.dispatch(fetchingTheData());

      try {
        const userFounded = await login(user, pass);
        listener.dispatch(
          defineUser(
            userFounded["_id"],
            userFounded.name,
            userFounded.email,
            userFounded.avatar,
            userFounded.history,
          ),
        );
      } catch (err) {
        setError(err.message);
      }
    };

    const signupMiddleware = async (name, email, password, avatar) => {
      listener.dispatch(fetchingTheData());

      try {
        const user = await signup(name, email, password, avatar);

        listener.dispatch(
          defineUser(user["_id"], user.name, user.email, user.avatar, []),
        );
      } catch (err) {
        setError(err.message);
      }
    };

    const deleteHistoryMiddleware = async () => {
      listener.dispatch(fetchingTheData());

      try {
        const user = await deleteHistory(
          act.payload.playerId,
          act.payload.historyId,
        );

        listener.dispatch(
          defineUser(
            user["_id"],
            user.name,
            user.email,
            user.avatar,
            user.history,
          ),
        );
      } catch (error) {
        setError(error.message);
      }
    };

    switch (type) {
      case "deleteHistory":
        await deleteHistoryMiddleware();
        break;
      case "login":
        listener.dispatch(fetchingTheData());
        await loginMiddleware(act.payload.name, act.payload.password);
        break;
      case "signup":
        listener.dispatch(fetchingTheData());
        console.log(act.payload);
        await signupMiddleware(
          act.payload.name,
          act.payload.email,
          act.payload.password,
          act.payload.avatar,
        );
        break;
      default:
        return;
    }
  },
});

export default authMiddleware;
