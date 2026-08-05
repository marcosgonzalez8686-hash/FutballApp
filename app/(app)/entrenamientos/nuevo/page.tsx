import { TrainingForm } from "../TrainingForm";
import { createTraining } from "../actions";

export default function NuevoEntrenamientoPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">
        Nuevo entrenamiento
      </h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <TrainingForm action={createTraining} />
      </div>
    </div>
  );
}
