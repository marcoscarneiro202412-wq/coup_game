import { characters } from "../data/characters";

export function logCreator(type, payload, players) {
  switch (type) {
    case "startGame":
      return { type, message: "O Jogo começou" };
    case "finalizeGame":
      return {
        type,
        playerId: payload.winner.id,
        message: `O Jogo terminou e o ganhador foi ${payload.winner.name}`,
      };
    case "giveALife": {
      const player = players.find(payload.id === payload);
      return {
        type,
        playerId: player.id,
        message: `O Jogador ${player.name} ganhou uma vida`,
      };
    }
    case "declareCharacter": {
      const playerDeclare = players.find((p) => p.id === payload.playerId);
      return {
        type,
        playerId: playerDeclare.id,
        message: payload.target
          ? `O jogador ${playerDeclare} declarou "${payload.characterId}" e "${characters.find((c) => c.id === payload.characterId)}" o ${players.find((p) => p.id === payload.targetId).name}`
          : `O jogador ${playerDeclare} declarou "${payload.characterId}"`,
      };
    }
    case "confront": {
      const confronter = players.find((p) => payload.confronterId === p.id);
      const confronted = players.find((p) => payload.confrontedId === p.id);

      return {
        type,
        playerId: confronter.id,
        message: `O jogador ${confronter.name} confrontou ${confronted.name}`,
      };
    }
    case "coupDEtat": {
      const player = players.find((p) => payload.playerId === p.id);
      const enemy = players.find((p) => payload.enemyId === p.id);

      return {
        type,
        playerId: player.id,
        message: `O jogador ${player.name} realizou um golpe contra ${enemy.name}`,
      };
    }

    case "bargain": {
      const player = players.find((p) => payload === p.id);

      return {
        type,
        playerId: player.id,
        message: `O jogador ${player.name} realizou uma barganha`,
      };
    }
    case "auxilio": {
      const player = players.find((p) => payload === p.id);

      return {
        type,
        player: player.id,
        message: `O jogador ${player.name} pediu um auxilio`,
      };
    }

    default:
      return false;
  }
}
