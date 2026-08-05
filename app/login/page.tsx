import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="pitch-header flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400" />
        <div className="p-6">
          <h1 className="mb-6 font-heading text-2xl font-semibold tracking-wide text-gray-900">
            ⚽ Club Fútbol
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
