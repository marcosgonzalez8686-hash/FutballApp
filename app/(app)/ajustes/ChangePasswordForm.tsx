"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";

export function ChangePasswordForm() {
  const [message, formAction, isPending] = useActionState(
    changePassword,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Contraseña actual
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Nueva contraseña
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirmar nueva contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      {message && message !== "OK" && (
        <p className="text-sm text-red-600">{message}</p>
      )}
      {message === "OK" && (
        <p className="text-sm text-green-700">Contraseña actualizada.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
