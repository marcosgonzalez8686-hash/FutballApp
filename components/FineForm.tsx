"use client";

import { useState } from "react";

type Concept = { id: string; name: string; category: string | null; amount: number };

const OTHER_VALUE = "OTRO";

export function FineForm({
  players,
  concepts,
  action,
}: {
  players: { id: string; name: string }[];
  concepts: Concept[];
  action: (formData: FormData) => void;
}) {
  const [amount, setAmount] = useState("");

  const grouped = new Map<string, Concept[]>();
  for (const concept of concepts) {
    const key = concept.category ?? "Otros";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(concept);
  }

  function handleConceptChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const concept = concepts.find((c) => c.id === e.target.value);
    if (concept) setAmount(String(concept.amount));
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="playerId" className="block text-sm font-medium text-gray-700">
          Jugador *
        </label>
        <select
          id="playerId"
          name="playerId"
          required
          defaultValue=""
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="" disabled>
            Selecciona un jugador
          </option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="conceptId" className="block text-sm font-medium text-gray-700">
          Concepto *
        </label>
        <select
          id="conceptId"
          name="conceptId"
          required
          defaultValue=""
          onChange={handleConceptChange}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          <option value="" disabled>
            Selecciona un concepto
          </option>
          {Array.from(grouped.entries()).map(([category, items]) => (
            <optgroup key={category} label={category}>
              {items.map((concept) => (
                <option key={concept.id} value={concept.id}>
                  {concept.name} ({concept.amount.toFixed(2)} €)
                </option>
              ))}
            </optgroup>
          ))}
          <option value={OTHER_VALUE}>Otro (personalizado)</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Importe (€) *
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min={0}
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comentarios
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={2}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Añadir multa
      </button>
    </form>
  );
}
