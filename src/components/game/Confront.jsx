import styles from "../styles/Declare.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confront } from "../../features/players/playerSlice";

function Confront({ playerId }) {
  const [player, setPlayer] = useState(0);
  const { players } = useSelector((s) => s.players);
  const dispatch = useDispatch();

  return (
    <div className={styles.declare}>
      <p>Confront Player</p>
      <FormControl fullWidth sx={{ color: "#fff" }}>
        <InputLabel sx={{ color: "#fff" }}>
          Players
        </InputLabel>
        <Select
          value={player}
          onChange={(ev) => setPlayer(+ev.target.value)}
          sx={{ borderColor: "#fff", color: "#fff" }}
        >
          {players.map((c, i) => (c.id !== playerId && c.alive) && (
            
            <MenuItem value={i} key={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={() => {
          dispatch(confront(playerId, players[player].id));
        }}
      >
        Confront
      </button>
    </div>
  );
}

export default Confront;
