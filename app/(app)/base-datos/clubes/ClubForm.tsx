import type { Rival } from "@/app/generated/prisma/client";

export function ClubForm({
  rival,
  action,
}: {
  rival?: Rival;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del club *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={rival?.name}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          Contacto
        </label>
        <input
          id="contact"
          name="contact"
          type="text"
          defaultValue={rival?.contact ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
          Campo
        </label>
        <input
          id="venue"
          name="venue"
          type="text"
          defaultValue={rival?.venue ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          id="address"
          name="address"
          type="text"
          defaultValue={rival?.address ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Teléfono de contacto
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={rival?.phone ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notas
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={rival?.notes ?? ""}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
      >
        Guardar
      </button>
    </form>
  );
}
