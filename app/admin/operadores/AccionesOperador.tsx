"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  isDeleted: boolean;
}

export default function AccionesOperador({ id, isDeleted }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleEstado() {
    setLoading(true);
    await fetch(`/api/admin/operadores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_deleted: !isDeleted }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={toggleEstado}
      disabled={loading}
      className={`px-3 py-1 rounded text-sm font-medium transition disabled:opacity-50 ${
        isDeleted
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-red-600 hover:bg-red-700 text-white"
      }`}
    >
      {loading ? "..." : isDeleted ? "Reactivar" : "Dar de baja"}
    </button>
  );
}