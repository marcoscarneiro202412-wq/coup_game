import { useDispatch, useSelector } from "react-redux";
import styles from "./History.module.css";
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { deleteHistory } from "../features/auth/authSlice";

function History() {
  const { history, id } = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  try {
    if (!history) return <Navigate to={"/"} />;

    return (
      <div className={styles.history}>
        <NavBar />
        <div className={styles.items}>
          {history.length ? (
            history.map((h) => (
              <div className={styles.item} key={h.id}>
                <div>
                  <h3>{h.id}</h3>
                  <p>Rounds: {h.rounds}</p>
                  <p>Winner: {h.winner}</p>
                  <p>Data: {h.data}</p>
                </div>
                <button
                  style={{
                    background: "red",
                    border: "1px solid #000",
                    color: "#fff",
                    width: "25px",
                    height: "25px",
                    borderRadius: "50%",
                    aspectRatio: "1",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(deleteHistory({ historyId: h.id, playerId: id }));
                  }}
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: "#fff" }}>Você Não jogou nenhuma partida</p>
          )}
        </div>
      </div>
    );
  } catch {
    return <Navigate to={"/"} />;
  }
}

export default History;
