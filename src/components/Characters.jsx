import { useSelector } from "react-redux";
import styles from "./Characters.module.css";
import { memo } from "react";

const Characters = memo(function Characters() {
  const player = useSelector((s) => s.players.players.at(s.turn.currentTurn));
  if(!player) return null;
  return (
    <div className={styles.characters}>
      <h1>Characters</h1>
      <div className={styles.players}>
        {player.characters.map((c) => (
          <img
            key={c.id}
            src={`/assets/${c.id}.png`}
            alt={`Image of ${c.name}`}
          />
        ))}
      </div>
    </div>
  );
});

export default Characters;
