"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoOperadorForm() {
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const form = e.currentTarget;
    const data = {
      nombre: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      apellido: (form.elements.namedItem("apellido") as HTMLInputElement).value,
      mail: (form.elements.namedItem("mail") as HTMLInputElement).value,
      celular: (form.elements.namedItem("celular") as HTMLInputElement).value,
      dni: (form.elements.namedItem("dni") as HTMLInputElement).value,
      cuil_cuit: (form.elements.namedItem("cuil_cuit") as HTMLInputElement).value,
      direccion: (form.elements.namedItem("direccion") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    const res = await fetch("/api/admin/operadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMensaje("✅ Operador creado correctamente");
      form.reset();
      router.refresh();
    } else {
      setMensaje("❌ Error al crear el operador");
    }

    setLoading(false);
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setAbierto(!abierto)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition mb-4"
      >
        {abierto ? "Cancelar" : "+ Nuevo operador"}
      </button>

      {abierto && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
          <h2 className="text-lg font-semibold text-white">Nuevo operador</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "nombre", placeholder: "Nombre", pattern: undefined, type: "text" },
              { name: "apellido", placeholder: "Apellido", pattern: undefined, type: "text" },
              { name: "mail", placeholder: "ejemplo@mail.com", pattern: undefined, type: "text" },
              { name: "celular", placeholder: "291-4123456", pattern: undefined, type: "text" },
              { name: "dni", placeholder: "12345678", pattern: "[0-9]{7,8}", type: "text" },
              { name: "cuil_cuit", placeholder: "20-12345678-9", pattern: "[0-9]{2}-[0-9]{7,8}-[0-9]", type: "text" },
              { name: "direccion", placeholder: "Av. Colón 1234, Bahía Blanca", pattern: undefined, type: "text" },
              { name: "password", placeholder: "Contraseña", pattern: undefined, type: "password" },
            ].map((field) => (
              <input
                key={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                pattern={field.pattern}
                required={["nombre", "apellido", "mail", "celular", "dni", "password"].includes(field.name)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 placeholder-gray-400"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear operador"}
          </button>
          {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
        </form>
      )}
    </div>
  );
}