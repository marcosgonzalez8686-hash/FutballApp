import { ClubForm } from "../ClubForm";
import { createRival } from "../actions";

export default function NuevoClubPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-500">Nuevo club</h2>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <ClubForm action={createRival} />
      </div>
    </div>
  );
}
