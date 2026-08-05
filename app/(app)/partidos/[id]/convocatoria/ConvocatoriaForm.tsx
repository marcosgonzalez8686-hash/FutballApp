"use client";

import { useState } from "react";

export function ConvocatoriaForm({
  players,
  action,
}: {
  players: { id: string; name: string; called: boolean }[];
  action: (formData: FormData) => void;
}) {
  const [count, setCount] = useState(
    players.filter((p) => p.called).length
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCount((current) => (e.target.checked ? current + 1 : current - 1));
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <p className="text-sm font-medium text-gray-900">
        {count} {count === 1 ? "convocado" : "convocados"}
      </p>

      <div className="flex flex-col gap-2">
        {players.map((player) => (
          <label
            key={player.id}
            className="flex items-center gap-2 rounded-md border border-gray-100 px-3 py-2 text-sm text-gray-900"
          >
            <input
              type="checkbox"
              name={`called-${player.id}`}
              defaultChecked={player.called}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            {player.name}
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Guardar convocatoria
      </button>
    </form>
  );
}
