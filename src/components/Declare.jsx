import styles from "./Declare.module.css";
import { characters } from "../data/characters";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {  declareCharacter } from "../features/players/playerSlice";

function Declare({ playerId }) {
  const [character, setCharacter] = useState("duke");
  const dispatch = useDispatch();

  return (
    <div className={styles.declare}>
      <p>Declare Character</p>
      <FormControl fullWidth sx={{ color: "#fff" }}>
        <InputLabel sx={{ color: "#fff" }} id="demo-simple-select-label">
          Characters
        </InputLabel>
        <Select
          value={character}
          onChange={(ev) => setCharacter(ev.target.value)}
          sx={{ borderColor: "#fff", color: "#fff" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
        >
          {characters.map((c) => (
            <MenuItem value={c.id} key={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={() => {
          dispatch(declareCharacter(playerId, character));
        }}
      >
        Declare
      </button>
    </div>
  );
}

export default Declare;
