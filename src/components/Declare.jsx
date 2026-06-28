import styles from "./Declare.module.css";
import { characters } from "../data/characters";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  declareCharacter,
  giveTheMoney,
  killPlayer,
  takeTheMoney,
} from "../features/players/playerSlice";

import Modal from "./Modal";
import PlayerAction from "./PlayerAction";
import { ASSASSIN_COST } from "../data/cost_characters";

function Declare({ playerId }) {
  const [isOpen, setIsOpen] = useState("");
  const [character, setCharacter] = useState("duke");
  const player = useSelector((st) => st.players.players[st.turn.currentTurn]);
  const players = useSelector((st) => st.players.players);
  const dispatch = useDispatch();

  const verifyAssassin = () => {
    if (
      player.money >= ASSASSIN_COST &&
      player.characters.some((c) => c.id === "assassin")
    ) {
      setIsOpen("assassin");
    } else {
      alert(
        "Declarado o assassino cujo custo ou personagem não tens, por isso, sua rodada será cancelada",
      );
    }
  };

  const verifyCaptain = () => {
    if (player.characters.some((c) => c.id === "captain")) {
      setIsOpen("captain");
    } else {
      alert(
        "Declarado o capitão cujo personagem não tens, por isso, sua rodada será cancelada",
      );
    }
  };

  const assassinAction = (attackedPlayerId) => {
    {
      dispatch(takeTheMoney(player.id, ASSASSIN_COST));
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
    dispatch(declareCharacter(playerId, character));
    setIsOpen("");
  };

  const captainAction = (attackedPlayerId) => {
    const playerTarget = players.find((p) => p.id === attackedPlayerId);
    if (playerTarget && player.characters.some((c) => c.id === "captain")) {
      if (playerTarget.money >= 2) dispatch(takeTheMoney(playerTarget.id, 2));
      dispatch(giveTheMoney(player.id, 2));
    } else {
      alert(
        "Você não tem o capitão ou o Jogador passado não existe passando para o próximo Jogador!",
      );
    }
    dispatch(declareCharacter(playerId, character));
    setIsOpen("");
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
              case "captain":
                verifyCaptain();
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
        <PlayerAction
          title={isOpen === "assassin" ? "Kill" : "Steal"}
          playerId={playerId}
          action={isOpen === "assassin" ? assassinAction : captainAction}
        />
      </Modal>
    </div>
  );
}

export default Declare;
