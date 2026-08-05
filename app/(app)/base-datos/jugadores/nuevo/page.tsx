import { PlayerForm } from "@/components/PlayerForm";
import { createPlayer } from "../actions";

export default function NuevoJugadorBaseDatosPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo jugador</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <PlayerForm action={createPlayer} />
      </div>
    </div>
  );
}
