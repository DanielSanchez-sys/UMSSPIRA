import { LoginForm } from '@/modules/auth/frontend/components/login-form';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#EEE9DF] lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#1B2632] p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-transparent to-[#1B2632]/40" />
        <div className="relative flex items-center gap-2 text-xs">
          <span className="rounded-full bg-black/30 px-3 py-1">UMSS · FCyT</span>
          <span className="rounded-full bg-black/30 px-3 py-1">
            Comunidad de egresados
          </span>
        </div>
        <div className="relative max-w-lg space-y-4">
          <div className="h-0.5 w-12 bg-[#FFB162]" />
          <p className="text-3xl font-semibold leading-snug">
            Conectando el talento de San Simón con el futuro profesional.
          </p>
          <p className="text-sm leading-relaxed text-white/75">
            Accede al portal de la comunidad de Ingeniería de Sistemas y
            mantente al día con sus eventos.
          </p>
        </div>
        <p className="relative text-xs text-white/60">
          UNIVERSIDAD MAYOR DE SAN SIMÓN · FACULTAD DE CIENCIAS Y TECNOLOGÍA
        </p>
      </aside>

      <section className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <div className="flex w-full max-w-md items-center justify-between">
          <div>
            <p className="text-xl font-extrabold leading-none text-[#1B2632]">
              UMSSPIRA
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#1B2632]">UMSS</p>
          </div>
          <span className="flex items-center gap-2 text-xs text-gray-600">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Acceso seguro
          </span>
        </div>

        <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-7 shadow-lg sm:p-9">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A35139]">
              Iniciar sesión
            </p>
            <h1 className="text-3xl font-bold text-[#1B2632]">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Ingresa con tu cuenta para acceder al portal de eventos.
            </p>
          </div>
          <LoginForm />
        </div>

        <p className="text-center text-[11px] text-gray-500">
          ¿Necesitas ayuda? Contacta a soporte.egresados@umss.edu.bo
        </p>
      </section>
    </main>
  );
}