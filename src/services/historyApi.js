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

export { deleteHistory };
