export default function NotFound() {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: "#030712", fontFamily: "sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "6rem", fontWeight: "bold", color: "#22d3ee", margin: "0 0 1rem" }}>404</h1>
          <h2 style={{ fontSize: "1.5rem", color: "white", margin: "0 0 0.5rem" }}>Página no encontrada</h2>
          <p style={{ color: "#9ca3af", margin: "0 0 2rem" }}>El recurso que buscás no existe.</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" style={{
            backgroundColor: "#22d3ee",
            color: "#030712",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            textDecoration: "none"
          }}>Volver al inicio</a>
        </div>
      </body>
    </html>
  );
}