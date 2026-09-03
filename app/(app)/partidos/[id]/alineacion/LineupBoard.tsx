"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { allSlotIds, slotPosition, TOTAL_LINEUP_DOLLS } from "@/lib/formation";

type LineupSlotData = {
  slotId: string;
  playerId: string | null;
  playerName: string | null;
};

type CalledPlayer = { id: string; name: string };

export function LineupBoard({
  slots,
  calledPlayers,
  moveDoll,
  assignPlayer,
  saveDefault,
}: {
  slots: LineupSlotData[];
  calledPlayers: CalledPlayer[];
  moveDoll: (sourceSlotId: string | null, targetSlotId: string | null) => Promise<void>;
  assignPlayer: (slotId: string, playerId: string | null) => Promise<void>;
  saveDefault: () => Promise<void>;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number; label: string } | null>(null);

  const dragStartRef = useRef<{
    sourceSlotId: string | null;
    pointerId: number;
    x: number;
    y: number;
  } | null>(null);
  const slotRefs = useRef(new Map<string, HTMLDivElement>());
  const benchRef = useRef<HTMLDivElement | null>(null);

  const slotMap = new Map(slots.map((s) => [s.slotId, s]));
  const benchCount = TOTAL_LINEUP_DOLLS - slots.length;
  const assignedIds = new Set(slots.filter((s) => s.playerId).map((s) => s.playerId));
  const remainingCalled = calledPlayers.filter((p) => !assignedIds.has(p.id));

  function handlePointerDown(
    e: React.PointerEvent<HTMLDivElement>,
    sourceSlotId: string | null,
    label: string
  ) {
    if (pending) return;
    e.preventDefault();
    dragStartRef.current = {
      sourceSlotId,
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
    };
    setGhost({ x: e.clientX, y: e.clientY, label });
  }

  useEffect(() => {
    if (!ghost) return;

    function findSlotAt(x: number, y: number): string | null {
      for (const [slotId, el] of slotRefs.current.entries()) {
        const rect = el.getBoundingClientRect();
        const pad = 10;
        if (
          x >= rect.left - pad &&
          x <= rect.right + pad &&
          y >= rect.top - pad &&
          y <= rect.bottom + pad
        ) {
          return slotId;
        }
      }
      return null;
    }

    function isWithinBench(x: number, y: number) {
      const el = benchRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }

    function onMove(e: PointerEvent) {
      if (!dragStartRef.current || e.pointerId !== dragStartRef.current.pointerId) return;
      setGhost((g) => (g ? { ...g, x: e.clientX, y: e.clientY } : g));
    }

    function onUp(e: PointerEvent) {
      const start = dragStartRef.current;
      if (!start || e.pointerId !== start.pointerId) return;
      const distance = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      dragStartRef.current = null;
      setGhost(null);

      if (distance < 8) {
        if (start.sourceSlotId !== null) {
          setOpenSlotId(start.sourceSlotId);
        }
        return;
      }

      const targetSlotId = findSlotAt(e.clientX, e.clientY);
      if (targetSlotId) {
        void performMove(start.sourceSlotId, targetSlotId);
      } else if (isWithinBench(e.clientX, e.clientY)) {
        void performMove(start.sourceSlotId, null);
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghost !== null]);

  async function performMove(sourceSlotId: string | null, targetSlotId: string | null) {
    setPending(true);
    try {
      await moveDoll(sourceSlotId, targetSlotId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleAssign(slotId: string, playerId: string | null) {
    setOpenSlotId(null);
    setPending(true);
    try {
      await assignPlayer(slotId, playerId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleSaveDefault() {
    setPending(true);
    try {
      await saveDefault();
      setSavedMessage("Formación guardada como predeterminada.");
      setTimeout(() => setSavedMessage(null), 3000);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {openSlotId && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenSlotId(null)} />
      )}

      <div className="flex flex-col gap-3">
        <div
          className="relative mx-auto w-full max-w-sm rounded-lg border border-green-900"
          style={{ aspectRatio: "2 / 3", background: "linear-gradient(#2f9e44, #2b8a3e)" }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/40" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />
          <div className="absolute inset-x-[20%] top-0 h-[10%] border-x border-b border-white/40" />
          <div className="absolute inset-x-[20%] bottom-0 h-[10%] border-x border-t border-white/40" />

          {allSlotIds().map((slotId) => {
            const pos = slotPosition(slotId);
            if (!pos) return null;
            const slot = slotMap.get(slotId);

            return (
              <div
                key={slotId}
                ref={(el) => {
                  if (el) slotRefs.current.set(slotId, el);
                  else slotRefs.current.delete(slotId);
                }}
                className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
              >
                {slot ? (
                  <div
                    onPointerDown={(e) =>
                      handlePointerDown(e, slotId, slot.playerName ?? "?")
                    }
                    className="flex h-10 w-10 touch-none select-none items-center justify-center rounded-full border-2 border-white bg-green-950 text-[10px] font-semibold text-white shadow"
                    style={{ touchAction: "none" }}
                  >
                    {slot.playerName ? initials(slot.playerName) : "?"}
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-dashed border-white/50" />
                )}

                {openSlotId === slotId && (
                  <div
                    className="absolute left-1/2 top-full z-20 mt-1 w-44 -translate-x-1/2 rounded-md border border-gray-200 bg-white p-1 text-left shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => void handleAssign(slotId, null)}
                      className="block w-full rounded px-2 py-1 text-left text-xs text-gray-500 hover:bg-gray-100"
                    >
                      Sin asignar
                    </button>
                    {remainingCalled.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => void handleAssign(slotId, p.id)}
                        className="block w-full truncate rounded px-2 py-1 text-left text-xs text-gray-900 hover:bg-gray-100"
                      >
                        {p.name}
                      </button>
                    ))}
                    {remainingCalled.length === 0 && (
                      <p className="px-2 py-1 text-xs text-gray-400">
                        No hay más convocados libres.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">
            Banquillo ({benchCount} sin colocar)
          </p>
          <div
            ref={benchRef}
            className="flex min-h-[3rem] flex-wrap gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2"
          >
            {Array.from({ length: benchCount }).map((_, i) => (
              <div
                key={i}
                onPointerDown={(e) => handlePointerDown(e, null, "?")}
                className="flex h-10 w-10 touch-none select-none items-center justify-center rounded-full border-2 border-gray-400 bg-white text-xs text-gray-400 shadow-sm"
                style={{ touchAction: "none" }}
              >
                ?
              </div>
            ))}
            {benchCount === 0 && (
              <p className="text-xs text-gray-400">Todos los muñecos están colocados.</p>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={() => void handleSaveDefault()}
          className="max-w-xs rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Guardar formación por defecto
        </button>
        {savedMessage && <p className="text-xs text-green-700">{savedMessage}</p>}
      </div>

      <div className="max-w-xs rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-medium text-gray-500">Convocatoria sin alinear</h3>
        {remainingCalled.length === 0 ? (
          <p className="text-sm text-gray-400">
            {calledPlayers.length === 0
              ? "No hay convocatoria para este partido."
              : "Todos los convocados están alineados."}
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {remainingCalled.map((p) => (
              <li key={p.id} className="text-sm text-gray-700">
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {ghost && (
        <div
          className="pointer-events-none fixed z-50 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-green-700 text-[10px] font-semibold text-white shadow-lg"
          style={{ top: ghost.y, left: ghost.x }}
        >
          {initials(ghost.label)}
        </div>
      )}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
