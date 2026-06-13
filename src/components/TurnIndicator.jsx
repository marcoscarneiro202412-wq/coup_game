import { useSelector } from "react-redux";
import styles from "./TurnIndicator.module.css";

function TurnIndicator() {
  const { currentTurn, round } = useSelector((s) => s.turn);

  return (
    <div className={styles.indicator}>
      <p>
        Current Round: <strong>Round {round}</strong>
      </p>
      <p>
        Current Turn: <strong>Turn {currentTurn + 1}</strong>
      </p>
    </div>
  );
}

export default TurnIndicator;
