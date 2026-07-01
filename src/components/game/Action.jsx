import styles from "../styles/Action.module.css";

function Action({ action, money }) {
  const { name, emote, cost, method, disabled } = action;
  return (
    <button
      className={styles.action}
      disabled={(money < cost) || disabled}
      onClick={() => {
        if (!(disabled ?? false)) {
          method();
        }
      }}
    >
      <span>{emote}</span>
      <h2>{name}</h2>
      <p>Cost: {cost}$</p>
    </button>
  );
}

export default Action;
