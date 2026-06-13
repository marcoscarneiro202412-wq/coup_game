export const characters = [
  {
    id: "duke",
    name: "Duke",
    action: "tax",
    description: "Recebe 3 moedas do tesouro.",
    attackOtherPlayer: false,
  },
  {
    id: "assassin",
    attackOtherPlayer: true,
    name: "Assassin",
    action: "assassinate",
    cost: 3,
    description: "Paga 3 moedas para eliminar uma influência de outro jogador.",
  },
  {
    id: "captain",
    name: "Captain",
    attackOtherPlayer: true,
    action: "steal",
    description: "Rouba até 2 moedas de outro jogador.",
  },
  {
    id: "ambassador",
    name: "Ambassador",
    attackOtherPlayer: false,
    action: "exchange",
    description: "Troca cartas com a corte.",
  },
  {
    id: "contessa",
    name: "Contessa",
    attackOtherPlayer: false,
    action: null,
    description: "Bloqueia tentativas de assassinato.",
  },
];
