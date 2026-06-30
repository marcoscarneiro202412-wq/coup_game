export function nextTurnEngine(players, currentTurn, currentRound) {
    let next = currentTurn;
    let round = currentRound;
    do {
        next++;

        if(next > players.length) {
            next = 0;
            round++;
        }
    } while(!players[next].alive);

    return {currentTurn: next, round};
}