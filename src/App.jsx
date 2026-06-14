import RegisterPlayers from "./pages/RegisterPlayers";
import Game from "./pages/Game";
import Winner from "./pages/Winner";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import History from "./pages/History";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetPage } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetPage());
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/" index element={<Home />} />
          <Route
            path="/login"
            index
            element={<AuthPage isLoginPage={true} />}
          />
          <Route
            path="/signup"
            index
            element={<AuthPage isLoginPage={false} />}
          />
          <Route path="game">
            <Route index element={<Navigate to={"/game/register"} replace />} />
            <Route path="register" element={<RegisterPlayers />} />
            <Route path="play" element={<Game />} />
            <Route path="winner" element={<Winner />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
