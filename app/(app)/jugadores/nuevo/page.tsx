import { PlayerForm } from "../PlayerForm";
import { createPlayer } from "../actions";

export default function NuevoJugadorPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo jugador</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm action={createPlayer} />
      </div>
    </div>
  );
}
