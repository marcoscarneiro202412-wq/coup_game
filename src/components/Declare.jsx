import styles from "./Declare.module.css";
import { characters } from "../data/characters";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { declareCharacter } from "../features/players/playerSlice";

import Modal from "./Modal";
import PlayerAction from "./PlayerAction";
import {
  assassinCharacterAction,
  captainCharacterAction,
} from "../domain/actions";
import verify from "../domain/verifyCharacter";

function Declare() {
  const [isOpen, setIsOpen] = useState("");
  const [character, setCharacter] = useState("duke");
  const players = useSelector((s) => s.players.players);
  const player = useSelector((st) => st.players.players[st.turn.currentTurn]);
  const dispatch = useDispatch();

  if (!player) return;

  // eslint-disable-next-line no-unused-vars
  const assassinAction = (attackedPlayerId) => {
    assassinCharacterAction(attackedPlayerId, player.id, dispatch, players);
    setIsOpen("");
  };

  const captainAction = (attackedPlayerId) => {
    captainCharacterAction(attackedPlayerId, player, players, dispatch);
    setIsOpen("");
  };

  const actions = {
    assassin: assassinAction,
    captain: captainAction,
  };

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
        >
          {characters.map((c) => (
            <MenuItem value={c.id} key={c.id}>
              {c.name} ({c.cost}$)
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={() => {
          if (
            characters.some((c) => c.id === character && c.attackOtherPlayer)
          ) {
            const playerCharacter = characters.find(
              (c) => c.id === character.toLowerCase(),
            );
            verify(playerCharacter.id, playerCharacter.cost, player, setIsOpen);
          } else {
            dispatch(declareCharacter(player.id, character));
          }
        }}
      >
        Declare
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PlayerAction
          title={isOpen === "assassin" ? "Kill" : "Steal"}
          playerId={player.id}
          action={actions[isOpen]}
        />
      </Modal>
    </div>
  );
}

export default Declare;
