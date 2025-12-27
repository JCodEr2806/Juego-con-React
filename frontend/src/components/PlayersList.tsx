interface Props {
  players: string[];
}

export default function PlayersList({ players }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Jugadores Conectados</h2>
      <ul className="bg-white rounded-lg shadow p-4 space-y-2">
        {players.map((player, i) => (
          <li key={i} className="text-gray-800">
            {i === 0 ? `👑 ${player} (creador)` : player}
          </li>
        ))}
      </ul>
    </div>
  );
}
