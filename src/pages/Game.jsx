import styles from "./styles/Game.module.css";
import Logo from "../components/game/Logo";
import Player from "../components/game/Player";
import Actions from "../components/game/Actions";
import AlivePlayers from "../components/game/AlivePlayers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Characters from "../components/game/Characters";
import Restart from "../components/game/Restart";

function Game() {
  const players = useSelector((s) => s.players.players);
  const [isVisible, setIsVisible] = useState(true);

  if (players.filter((p) => p.alive).length === 1)
    return <Navigate to="/game/winner" replace />;

  if (players.length < 1) return <Navigate to={"/game/register"} replace />;

  return (
    <div className={styles.game}>
      <Restart />
      {isVisible && <Characters />}
      <div className={styles.principal}>
        <Logo />
        <p
          style={{ fontSize: "36px", color: "#fff", cursor: "pointer" }}
          onClick={() => setIsVisible((p) => !p)}
        >
          {isVisible ? "Não" : ""} Mostrar Personagens
          {isVisible ? `👁️🔒` : "👁️"}
        </p>
        <Player />
        <Actions />
        <AlivePlayers />
      </div>
    </div>
  );
}

export default Game;
