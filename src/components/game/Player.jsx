import { useSelector } from "react-redux";
import styles from "../styles/Player.module.css";
import PlayerImg from "./PlayerImg";

function Player() {
  const { players } = useSelector((st) => st.players);
  const { currentTurn } = useSelector((st) => st.turn);

  const player = players.at(currentTurn % players.length);
  if (!player) return null;

  return (
    <div className={styles.player}>
      <div className={styles.personal}>
        <PlayerImg />
      </div>
      <div className={styles.info}>
        <h2>{player.name}</h2>
        <p>
          <span>💵</span> {player.money}$
        </p>
        <p>
          <span>❤️</span> {player.hp} HP
        </p>
      </div>
    </div>
  );
}

export default Player;
