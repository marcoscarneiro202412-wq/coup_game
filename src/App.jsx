import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetPage } from "./features/auth/authSlice";
import LoaderFullPage from "./components/ui/LoaderFullPage";

const ProtectedRoute = lazy(() => import("./pages/routes/ProtectedRoute"));
const RegisterPlayers = lazy(() => import("./pages/RegisterPlayers"));
const Game = lazy(() => import("./pages/Game"));
const Winner = lazy(() => import("./pages/Winner"));
const Home = lazy(() => import("./pages/Home"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const History = lazy(() => import("./pages/History"));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetPage());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderFullPage />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
