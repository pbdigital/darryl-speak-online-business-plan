import qrcode from "qrcode-generator";

/** A QR code drawn as one SVG path, generated locally. */
export function PlanQrCode({ value, className }: { value: string; className?: string }) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();

  const size = qr.getModuleCount();
  let path = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (qr.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      className={className}
      role="img"
      aria-label={`QR code for ${value}`}
      shapeRendering="crispEdges"
    >
      <rect x={-2} y={-2} width={size + 4} height={size + 4} fill="#fff" />
      <path d={path} fill="#0f172a" />
    </svg>
  );
}
