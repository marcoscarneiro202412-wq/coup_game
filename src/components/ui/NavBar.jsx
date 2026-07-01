import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/NavBar.module.css";

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <img src="/assets/logo.png" alt="Logo do coup" />
        <p className={styles.title}>COUP</p>
      </div>
      <ul className={styles.actions}>
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/history"}>History</NavLink>
        <NavLink to={"/login"} className={styles.login}>
          Login
        </NavLink>
      </ul>
    </nav>
  );
}

export default NavBar;
