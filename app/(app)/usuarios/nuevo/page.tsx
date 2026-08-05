import { NewUserForm } from "../NewUserForm";

export default function NuevoUsuarioPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-gray-900">Nuevo usuario</h1>
      <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6">
        <NewUserForm />
      </div>
    </div>
  );
}
