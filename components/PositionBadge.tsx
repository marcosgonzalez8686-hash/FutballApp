export function PositionBadge({ position }: { position: string | null }) {
  if (!position) return <span className="text-gray-400">-</span>;

  return (
    <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-semibold tracking-wide text-green-800">
      {position}
    </span>
  );
}
