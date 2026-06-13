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

function Actions() {
  const { players } = useSelector((st) => st.players);
  const { currentTurn } = useSelector((st) => st.turn);
  const player = players[currentTurn % players.length];
  const dispatch = useDispatch()
  if (!player) return null;
  const actions = [
    {
      name: "Coup D'Etat",
      emote: "⚔️",
      cost: 7,
      method: () => {
        if (player.money < 7) return;
        const person = prompt("Escolha uma pessoa para retirar uma vida");
        const target = players.find((c) => c.name === person);
        console.log(person);
        if (target) {
          return coupDEtat(player.id, target.id);
        }
      },
    },
    {
      name: "Bargain",
      emote: "↔️",
      cost: 6,
      method: () => {if(player.money >= 6)dispatch(bargain(player.id))},
    },
    {
      name: "Ritual",
      emote: "🪦",
      cost: 18,
      disabled: player.hp >= 5,
      method: () => {if(player.money >= 18) dispatch(giveALive(player.id))},
    },
    {
      name: "Pedir Auxilio",
      emote: "🪙",
      cost: 0,
      method: () => auxilio(player.id),
    },
  ];

  return (
    <div className={styles.actions}>
      <p>Actions</p>
      <div className={styles["actions-buttons"]}>
        <Declare playerId={player.id} />
        {actions.map((a, i) => (
          <Action action={a} key={i} money={player.money} />
        ))}
        <Confront playerId={player.id} />
      </div>
    </div>
  );
}

export default Actions;
