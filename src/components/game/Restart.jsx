import { restartLocalStorageGame } from "../../services/storage";
import styles from "../styles/Restart.module.css";

function Restart() {
  return (
    <div className={styles["container"]}>
      <p>Reinicar a memória do jogo</p>
      <span
        onClick={() => {
          restartLocalStorageGame();
          window.location.reload();
        }}
        className={styles.restart}
      >
        &#8635;
      </span>
    </div>
  );
}

export default Restart;
