import { useState } from "react";
import { useSelector } from "react-redux";

function PlayerImg({ className, player = null }) {
  const playerActual = useSelector((s) =>
    s.players.players.at(s.turn.currentTurn),
  );

  const [src, setSrc] = useState(
    player?.imgUrl ?? playerActual?.imgUrl ?? "deksjde",
  );

  return (
    <img
      className={className}
      src={src}
      alt={`${player?.name ?? playerActual?.name}'s photo`}
      onError={() => {
        setSrc(
          "https://i.pinimg.com/236x/02/72/35/02723528ae01d17bbf67ccf6b8da8a6b.jpg",
        );
      }}
    />
  );
}

export default PlayerImg;
