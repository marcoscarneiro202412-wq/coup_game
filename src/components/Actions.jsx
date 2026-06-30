import { useDispatch, useSelector } from "react-redux";
import styles from "./Actions.module.css";
import Declare from "./Declare";
import {
  auxilio,
  bargain,
  coupDEtat,
  giveALive,
} from "../features/players/playerSlice";
import Action from "./Action";
import Confront from "./Confront";
import { useState } from "react";
import Modal from "./Modal";
import PlayerAction from "./PlayerAction";

function Actions() {
  const [isOpen, setIsOpen] = useState(false);
  const { players, error } = useSelector((st) => st.players);
  const { currentTurn } = useSelector((st) => st.turn);
  const player = players[currentTurn % players.length];
  const dispatch = useDispatch();
  if (!player) return null;
  const actions = [
    {
      name: "Coup D'Etat",
      emote: "⚔️",
      cost: 7,
      method: () => {
        if (player.money < 7) return;
        setIsOpen(true);
      },
    },
    {
      name: "Bargain",
      emote: "↔️",
      cost: 6,
      method: () => {
        if (player.money >= 6) dispatch(bargain(player.id));
      },
    },
    {
      name: "Ritual",
      emote: "🪦",
      cost: 18,
      disabled: player.hp >= 5,
      method: () => {
        if (player.money >= 18) dispatch(giveALive(player.id));
      },
    },
    {
      name: "Pedir Auxilio",
      emote: "🪙",
      cost: 0,
      method: () => dispatch(auxilio(player.id)),
    },
  ];

  return (
    <div className={styles.actions}>
      <p className={styles.title}>Actions</p>
      <div className={styles["actions-buttons"]}>
        <Declare />
        {actions.map((a, i) => (
          <Action action={a} key={i} money={player.money} />
        ))}
        <Confront playerId={player.id} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PlayerAction
          playerId={player.id}
          action={(attackedPlayer) => {
            dispatch(coupDEtat(player.id, attackedPlayer));
            setIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default Actions;
