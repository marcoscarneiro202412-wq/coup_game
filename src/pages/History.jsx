import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/History.module.css";
import NavBar from "../components/ui/NavBar";
import { deleteHistory } from "../features/auth/authSlice";

function History() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((s) => s.auth);
  const { history, id } = user;

  return (
    <div className={styles.history}>
      <NavBar />
      <div className={styles.items}>
        {history.length ? (
          history.map((h) => {
            console.log(h);
            return (
              <div className={styles.item} key={h.id}>
                <div>
                  <h3>{h.id}</h3>
                  <p>Rounds: {h.rounds}</p>
                  <p>Winner: {h.winner}</p>
                  <p>Data: {h.date}</p>
                </div>
                <button
                  disabled={isLoading}
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
                    if (isLoading) return;
                    dispatch(deleteHistory({ historyId: h.id, playerId: id }));
                  }}
                >
                  &times;
                </button>
              </div>
            );
          })
        ) : (
          <p
            style={{
              color: "#fff",
              textAlign: "center",
              alignSelf: "center",
              fontSize: "22px",
            }}
          >
            ❌ Você Não jogou nenhuma partida
          </p>
        )}
      </div>
    </div>
  );
}

export default History;
