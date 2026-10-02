import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="pitch-header flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="club-stripe" />
        <div className="p-6">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <Image
              src="/escudo.png"
              alt="Escudo AD Lavadores"
              width={68}
              height={96}
              priority
              className="h-24 w-auto drop-shadow-md"
            />
            <h1 className="font-heading text-2xl font-semibold tracking-wide text-gray-900">
              AD Lavadores
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
