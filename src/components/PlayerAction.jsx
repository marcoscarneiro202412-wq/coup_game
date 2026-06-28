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
        <InputLabel sx={{ color: "#fff" }} id="demo-simple-select-label">
          Players
        </InputLabel>
        <Select
          value={player}
          onChange={(ev) => setPlayer(ev.target.value)}
          sx={{ borderColor: "#fff", color: "#fff" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
        >
          {players.map(
            (c, i) =>
              c.id !== playerId && (
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
