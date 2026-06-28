import styles from "./Declare.module.css";
import { characters } from "../data/characters";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  declareCharacter,
  killPlayer,
  takeTheMoney,
} from "../features/players/playerSlice";

import Modal from "./Modal";
import KillPlayer from "./KillPlayer";

function Declare({ playerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [character, setCharacter] = useState("duke");
  const player = useSelector((st) => st.players.players[st.turn.currentTurn]);
  const players = useSelector((st) => st.players.players);
  const dispatch = useDispatch();

  const verifyAssassin = () => {
    if (
      player.money >= 3 &&
      player.characters.some((c) => c.id === "assassin")
    ) {
      setIsOpen(true);
    } else {
      alert(
        "Declarado o assassino cujo custo ou personagem não tens, por isso, sua rodada será cancelada",
      );
    }
  };

  const assassinAction = (attackedPlayerId) => {
    {
      dispatch(takeTheMoney(player.id, 3));
      const target = players.find((p) => p.id === attackedPlayerId);
      if (!target) {
        alert("O jogador que você digitou não existe! Passando turno");
        return;
      }
      if (!target.characters.some((c) => c.id === "contessa")) {
        dispatch(killPlayer(attackedPlayerId));
      } else {
        alert("A condessa bloqueia sua faca (e seu dinheiro também)");
      }
    }
    setIsOpen(false);
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
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={() => {
          if (
            characters.some((c) => c.id === character && c.attackOtherPlayer)
          ) {
            switch (character) {
              case "assassin":
                verifyAssassin();
                break;
            }
          } else {
            dispatch(declareCharacter(playerId, character));
          }
        }}
      >
        Declare
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <KillPlayer action={assassinAction} />
      </Modal>
    </div>
  );
}

export default Declare;
