import { RivalForm } from "../RivalForm";
import { createRival } from "../actions";

export default function NuevoRivalPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo rival</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <RivalForm action={createRival} />
      </div>
    </div>
  );
}
