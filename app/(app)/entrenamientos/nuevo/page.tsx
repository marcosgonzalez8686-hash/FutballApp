import { TrainingForm } from "../TrainingForm";
import { createTraining } from "../actions";

export default function NuevoEntrenamientoPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Nuevo entrenamiento
      </h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <TrainingForm action={createTraining} />
      </div>
    </div>
  );
}
