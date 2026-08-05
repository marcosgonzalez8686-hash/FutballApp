import { MaterialForm } from "../MaterialForm";
import { createMaterial } from "../actions";

export default function NuevoMaterialPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo material</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <MaterialForm action={createMaterial} />
      </div>
    </div>
  );
}
