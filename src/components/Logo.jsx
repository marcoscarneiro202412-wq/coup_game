import styles from "./Logo.module.css";
import TurnIndicator from "./TurnIndicator";

function Logo() {
  return (
    <div className={styles.logo}>
      <div>
        <img src="/assets/logo.png" alt="Logo do coup" />
        <p className={styles.title}>COUP</p>
      </div>
      <TurnIndicator />
    </div>
  );
}

export default Logo;
