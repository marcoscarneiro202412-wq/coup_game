import styles from "./Action.module.css";

function Action({ action, money }) {
  const { name, emote, cost, method, disabled } = action;
  return (
    <div
      className={styles.action}
      disabled={money < cost || (disabled ?? false)}
      onClick={() => {
        if (!(disabled ?? false)) {
          method();
        }
      }}
    >
      <span>{emote}</span>
      <h2>{name}</h2>
      <p>Cost: {cost}$</p>
    </div>
  );
}

export default Action;
