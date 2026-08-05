import { CoachForm } from "../CoachForm";
import { createCoach } from "../actions";

export default function NuevoEntrenadorPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo entrenador</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <CoachForm action={createCoach} />
      </div>
    </div>
  );
}
