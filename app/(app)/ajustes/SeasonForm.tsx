"use client";

import { changeSeason } from "./actions";

export function SeasonForm({ currentSeasonName }: { currentSeasonName: string }) {
  return (
    <form
      action={changeSeason}
      onSubmit={(e) => {
        const name = new FormData(e.currentTarget).get("name") as string;
        if (
          !confirm(
            `¿Iniciar la temporada "${name}"? "${currentSeasonName}" dejará de ser la vigente y sus entrenamientos y partidos dejarán de aparecer en los listados actuales (seguirán consultables).`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre de la nueva temporada
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="2027/2028"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Iniciar nueva temporada
      </button>
    </form>
  );
}
