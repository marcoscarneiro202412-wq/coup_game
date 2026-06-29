import styles from "./Declare.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { confront } from "../features/players/playerSlice";

function Confront({ playerId }) {
  const [player, setPlayer] = useState(0);
  const { players } = useSelector((s) => s.players);
  const dispatch = useDispatch();

  return (
    <div className={styles.declare}>
      <p>Confront Player</p>
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
          {players.map((c, i) => c.id !== playerId && (
            
            <MenuItem value={i} key={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={() => {
          dispatch(confront(playerId, player));
        }}
      >
        Confront
      </button>
    </div>
  );
}

export default Confront;
