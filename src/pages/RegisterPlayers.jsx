import {
  createPlayer,
  generateCharacterForPlayers,
} from "../features/players/playerSlice";
import { useRef } from "react";
import { startGame } from "../features/game/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles/RegisterPlayers.module.css";
import User from "../components/layout/User";
import { useNavigate } from "react-router-dom";

function RegisterPlayers() {
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const imgUrlRef = useRef(null);
  const players = useSelector((st) => st.players.players);
  const dispatch = useDispatch();

  return (
    <div className={styles.register}>
      <User />
      <div className={styles.players}>
        <h1>Jogadores</h1>
        {players.length > 0 ? (
          players.map((p, i) => (
            <div key={i} className={styles.player}>
              <img src={p.imgUrl} />
              <p>{p.name}</p>
            </div>
          ))
        ) : (
          <p className={styles.message}>
            🫡 Não tem nenhum Jogador criado. Crie um agora!
          </p>
        )}
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (players.some((p) => p.name === nameRef.current.value)) {
            alert("Não coloque nomes iguais");
            return;
          }
          dispatch(
            createPlayer(nameRef.current.value, imgUrlRef.current.value),
          );
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "42px" }}>Registrar Jogadores</h1>
        <input required placeholder="Nome do Jogador" ref={nameRef} />
        <input placeholder="Url do Jogador" ref={imgUrlRef} />
        <button>Cadastrar Jogador</button>
      </form>

      <button
        onClick={() => {
          navigate("/game/play", { replace: true });
          dispatch(generateCharacterForPlayers());
          dispatch(startGame());
        }}
        disabled={players.length < 3}
      >
        Começar Jogo
      </button>
    </div>
  );
}

export default RegisterPlayers;
