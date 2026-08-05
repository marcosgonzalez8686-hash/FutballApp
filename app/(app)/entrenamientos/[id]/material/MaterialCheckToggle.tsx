"use client";

export function MaterialCheckToggle({
  defaultChecked,
  action,
}: {
  defaultChecked: boolean;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <input
        type="checkbox"
        name="collected"
        defaultChecked={defaultChecked}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-4 w-4 rounded border-gray-300"
      />
    </form>
  );
}
