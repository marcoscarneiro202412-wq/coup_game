import styles from "./Game.module.css";
import Logo from "../components/Logo";
import Player from "../components/Player";
import Actions from "../components/Actions";
import AlivePlayers from "../components/AlivePlayers";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Characters from "../components/Characters";

function Game() {
  const players = useSelector((s) => s.players.players);
  const [isVisible, setIsVisible] = useState(true);

  if (players.filter((p) => p.alive).length === 1)
    return <Navigate to="/game/winner" replace />;

  if (players.length < 1) return <Navigate to={"/game/register"} replace />;

  return (
    <div className={styles.game}>
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
