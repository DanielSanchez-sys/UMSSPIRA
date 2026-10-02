type BarraProgresoProps = {
  completas: number;
  total: number;
};

export function BarraProgreso({ completas, total }: BarraProgresoProps) {
  const porcentaje = Math.round((completas / total) * 100);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del perfil"
        className="h-2 w-full overflow-hidden rounded-full sm:flex-1 bg-[#C9C1B1]/50"
      >
        <div
          className="h-full rounded-full bg-[#FFB162] transition-all duration-300"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-[#2C3B4D]">
        {completas} de {total} secciones completas
      </span>
    </div>
  );
}