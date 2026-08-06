"use client";

const variantClasses = {
  danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  neutral: "border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100",
};

export function DeleteButton({
  label,
  confirmMessage,
  variant = "danger",
}: {
  label: string;
  confirmMessage: string;
  variant?: "danger" | "neutral";
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={`rounded-md border px-4 py-2 text-sm font-medium ${variantClasses[variant]}`}
    >
      {label}
    </button>
  );
}
