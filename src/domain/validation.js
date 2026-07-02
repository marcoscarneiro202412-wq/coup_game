const verify = (character, cost = 0, player, setIsOpen) => {
  if (!character || !player) return;
  if (
    player.characters.some((c) => c.id === character.toLowerCase()) &&
    player.money >= cost
  ) {
    setIsOpen?.(character);
  } else {
    alert(
      cost === 0
        ? "O personagem que você declarou precisa ser revelado e você não o tem"
        : "Você não tem dinheiro para pagar ou você não tem  o personagem!",
    );
  }

  return (
    player.characters.some((c) => c.id === character.toLowerCase()) &&
    player.money >= cost
  );
};

const canAction = (val, player) => player.money >= val;

const canRitual = (player) => canAction(18, player);
const canCoup = (player) => canAction(7, player);
const canBargain = (player) => canAction(5, player);

export default verify;
export { canRitual, canCoup, canBargain };
