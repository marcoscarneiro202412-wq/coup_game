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
import ProtectedRoute from "./pages/routes/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetPage());
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
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
            <Route
              path="register"
              element={
                <ProtectedRoute>
                  <RegisterPlayers />
                </ProtectedRoute>
              }
            />
            <Route
              path="play"
              element={
                <ProtectedRoute>
                  <Game />
                </ProtectedRoute>
              }
            />
            <Route
              path="winner"
              element={
                <ProtectedRoute>
                  <Winner />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
