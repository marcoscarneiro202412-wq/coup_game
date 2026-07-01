import { useSelector } from "react-redux";
import styles from "../styles/CardPlayer.module.css";
import PlayerImg from "./PlayerImg";

function CardPlayer({ player }) {
  const { players } = useSelector((s) => s.players);
  const { currentTurn } = useSelector((s) => s.turn);
  return (
    <div
      className={`${styles.card} ${players.at(currentTurn % players.length)?.id === player.id ? styles.active : player.alive ? "":styles.dead}`}
    >
      <PlayerImg player={player} />
      <div className={`styles.info`}>
        <h3>{player.name}</h3>
        <p>
          <span>🪙</span> {player.money}
        </p>
      </div>
    </div>
  );
}

export default CardPlayer;
