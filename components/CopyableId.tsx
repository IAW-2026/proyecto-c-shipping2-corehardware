"use client";

import { useState } from "react";

interface Props {
  value: string;
  truncate?: number;
  prefix?: string;
  className?: string;
}

export default function CopyableId({
  value,
  truncate = 8,
  prefix = "",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // navegador sin permiso de clipboard — silenciar
    }
  }

  const display = value.length > truncate ? `${value.slice(0, truncate)}...` : value;

  return (
    <span
      title={copied ? "¡Copiado!" : `${value} — click para copiar`}
      onClick={handleCopy}
      className={`font-mono text-sm cursor-pointer transition select-none ${
        copied ? "text-green-400" : "hover:text-cyan-400"
      } ${className}`}
    >
      {prefix}
      {display}
      {copied && <span className="ml-1 text-xs">✓</span>}
    </span>
  );
}
