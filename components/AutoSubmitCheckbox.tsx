"use client";

export function AutoSubmitCheckbox({
  name,
  defaultChecked,
  action,
}: {
  name: string;
  defaultChecked: boolean;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="h-4 w-4 rounded border-gray-300"
      />
    </form>
  );
}
