import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  defineUser,
  fetchingTheData,
  setError,
} from "../features/auth/authSlice";

const authMiddleware = createListenerMiddleware();

authMiddleware.startListening({
  predicate(act) {
    return act.type.startsWith("auth");
  },

  effect: async (act, listener) => {
    const type = act.type.split("/")[1];
    const login = async (user, pass) => {
      console.log(user, pass);
      const res = await fetch(
        "https://users-api-coup.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user,
            password: pass,
          }),
        },
      );

      if (!res.ok) {
        listener.dispatch(setError("Verifique seu email/senha"));
        return;
      }

      const userFounded = await res.json();

      listener.dispatch(
        defineUser(
          userFounded["_id"],
          userFounded.name,
          userFounded.email,
          userFounded.avatar,
          userFounded.history,
        ),
      );
    };
    const signup = async (name, email, password, avatar) => {
      const userSchema = {
        name,
        email,
        password,
        avatar:
          avatar ??
          "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
      };

      const res = await fetch(
        "https://users-api-coup.onrender.com/auth/signup",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(userSchema),
        },
      );
      const user = await res.json();
      if (res.ok) {
        console.log(userSchema);
        listener.dispatch(
          defineUser(user["_id"], user.name, user.email, user.avatar, []),
        );
      } else {
        listener.dispatch(setError("Ocorreu um erro inesperado!"));
      }
    };

    const deleteHistory = async () => {
      console.log("djhd")
      listener.dispatch(fetchingTheData());
      const res = await fetch(
        "https://users-api-coup.onrender.com/history/delete",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
          body: JSON.stringify({ playerId: act.payload.playerId, historyId: act.payload.historyId }),
        },
      );
      const data = await res.json();
      listener.dispatch(defineUser(data["_id"] ,data.name, data.email, data.avatar, data.history));
    };

    switch (type) {
      case "deleteHistory":
        await deleteHistory()
        break;
      case "login":
        listener.dispatch(fetchingTheData());
        await login(act.payload.name, act.payload.password);
        break;
      case "signup":
        listener.dispatch(fetchingTheData());
        console.log(act.payload);
        await signup(
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
