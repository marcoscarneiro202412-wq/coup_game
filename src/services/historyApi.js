const deleteHistory = async (playerId, historyId) => {
  const res = await fetch(
    "https://users-api-coup.onrender.com/history/delete",
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        playerId: playerId,
        historyId: historyId,
      }),
    },
  );
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw new Error("Ocorreu um erro inesperado!");
  }
};

const createHistory = async (id, winnerName, rounds, players) => {
  const res = await fetch(
    "https://users-api-coup.onrender.com/history/create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: id,
        game: {
          winner: winnerName,
          rounds: rounds,
          players
        },
      }),
    },
  );

  if(res.ok) {
    return await res.json()
  } else {
    
    throw new Error("Ocorreu um erro inesperado no salvamento do histórico!\n" + (await res.json()) );
  }
};

export { deleteHistory, createHistory };
