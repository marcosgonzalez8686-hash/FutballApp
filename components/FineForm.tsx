export function FineForm({
  players,
  action,
}: {
  players: { id: string; name: string }[];
  action: (formData: FormData) => void;
}) {
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

      <div className="grid grid-cols-2 gap-4">
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
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Motivo *
          </label>
          <select
            id="reason"
            name="reason"
            required
            defaultValue="TARDE"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="TARDE">Llega tarde</option>
            <option value="AUSENCIA_NO_JUSTIFICADA">Ausencia no justificada</option>
            <option value="OTROS">Otros</option>
          </select>
        </div>
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
