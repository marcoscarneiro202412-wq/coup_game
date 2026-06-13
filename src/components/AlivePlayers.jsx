import { useSelector } from "react-redux";
import styles from "./AlivePlayers.module.css";
import CardPlayer from "./CardPlayer";

function AlivePlayers() {
  const { players } = useSelector((s) => s.players);
  if(players.length <= 1) return null;
  return (
    <div className={`${styles["alive-players"]} `}>
      <p className={styles.title}>Alive Players</p>
      <div className={styles.playersAlive}>
        {players.map((p) => (
          <CardPlayer key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}

export default AlivePlayers;
