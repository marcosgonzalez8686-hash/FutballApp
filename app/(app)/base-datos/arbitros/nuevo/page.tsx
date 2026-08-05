import { RefereeForm } from "../RefereeForm";
import { createReferee } from "../actions";

export default function NuevoArbitroPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo árbitro</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <RefereeForm action={createReferee} />
      </div>
    </div>
  );
}
