import styles from "./Declare.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import {  useSelector } from "react-redux";

function ActionPlayer({ playerId, action, title="Kill" }) {
  const [player, setPlayer] = useState(0);
  const { players } = useSelector((s) => s.players);

  return (
    <div className={styles.declare}>
      <p>{title} Player</p>
      <FormControl fullWidth sx={{ color: "#fff" }}>
        <InputLabel sx={{ color: "#fff" }}>
          Players
        </InputLabel>
        <Select
          value={player}
          onChange={(ev) => setPlayer(ev.target.value)}
          sx={{ borderColor: "#fff", color: "#fff" }}
        >
          {players.map(
            (c, i) =>
              (c.id !== playerId && c.alive) && (
                <MenuItem value={i} key={c.id}>
                  {c.name}
                </MenuItem>
              ),
          )}
        </Select>
      </FormControl>
      <button onClick={() => {
        const attackedPlayer = players[player];
        if(attackedPlayer) {
            action(attackedPlayer.id);
        } else {
            alert("Jogador não encontrado φ(*￣0￣)")
        }
      }}>{title}</button>
    </div>
  );
}

export default ActionPlayer;
