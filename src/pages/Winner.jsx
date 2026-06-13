// import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Winner.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { cleanThePlayers } from "../features/players/playerSlice";
import { restartState } from "../features/game/turnSlice";

function Winner() {
  const navigate = useNavigate();
  const winner = useSelector((st) => {
    return st.players.players.find((p) => p.id === st.game.winner);
  });
  const dispatch = useDispatch();
  if (!winner) return <Navigate to={"/"} replace />;

  return (
    <div className={styles.winner}>
      <span>👑</span>
      <h1>E o ganhador da partida foi: {winner.name}</h1>
      <div>
        <img
          src="https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg"
          alt="Guest"
        />
        <p>{winner.name}</p>
      </div>
      <button
        onClick={() => {
          dispatch(cleanThePlayers());

          dispatch(restartState());
          navigate("/", { replace: true });
        }}
      >
        Voltar para a Home
      </button>
    </div>
  );
}

export default Winner;
