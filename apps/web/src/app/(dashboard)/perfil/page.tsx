import { ChevronRight } from 'lucide-react';
import { AcordeonPerfil} from '@/shared/components/perfil/FormularioAcordion';

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-[#EEE9DF]">
      <main className="max-w-[960px] px-4 py-6 md:px-8 md:py-8">
        <nav aria-label="Ruta" className="flex items-center gap-1 text-xs text-[#2C3B4D]/60">
          <span>Inicio</span>
          <ChevronRight className="h-3 w-3" />
          <span>Perfil de Egresado</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-[#2C3B4D]">Completar formulario</span>
        </nav>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#A35139]">
          Perfil profesional extendido
        </p>
        <h1 className="mt-1.5 text-2xl font-bold leading-[30px] text-[#2C3B4D] md:text-[32px] md:leading-10">
          Completar perfil
        </h1>
        <p className="mt-1.5 text-sm text-[#2C3B4D]/70">
          Registra tu formación académica, experiencia laboral y certificaciones. 
        </p>
        <div className="mt-5">
          <AcordeonPerfil />
        </div>
      </main>
    </div>
  );
}
