import { useNavigate } from "react-router-dom";
import styles from "./styles/Home.module.css";
import NavBar from "../components/ui/NavBar";

function Home() {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      <NavBar />
      <h1>Coup</h1>
      <div className={styles.central}>
        <h2>Jogue Esse Jogo Fascinante</h2>
        <p>
          Blefe, astúcia e influência. Elimine seus oponentes e torne-se o
          último nobre de pé! O jogo de intriga que testa sua capacidade de ler
          pessoas.
        </p>
        <button onClick={() =>  navigate("/login")}>Ir para Login</button>
      </div>
    </div>
  );
}

export default Home;
