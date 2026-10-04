import { Building2 } from "lucide-react";

interface CompanyHeaderProps {
    companyName?: string;
    companySlogan?: string;
    logoUrl?: string;
    bannerImageUrl?: string;
}

export function CompanyHeader({
    companyName = " TechSolutions S.A",
    companySlogan = "Innovación y soluciones.",
    logoUrl,
    bannerImageUrl = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
}: CompanyHeaderProps) {
    return (
        <div className="w-full mb-6">
            {/* Contenedor principal con Abyssal Anchorfish Blue (#182632) */}
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#182632] shadow-sm flex flex-col sm:flex-row border border-[#C9C1B1]">

                {/* Lado izquierdo: Información y Logotipo */}
                <div className="relative z-10 flex items-center h-full px-6 sm:px-8 py-6 w-full sm:w-1/2 gap-5">
                    {/* Tarjeta del Logotipo con fondo Palladian (#EEE9DF) */}
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#EEE9DF] shadow-md flex items-center justify-center shrink-0 overflow-hidden border border-[#C9C1B1]">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Company Logo"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Building2 className="w-10 h-10 text-[#2C3B40]" />
                        )}
                    </div>

                    {/* Textos: Nombre y Eslogan */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {companyName}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#EEE9DF] mt-1 font-normal leading-relaxed">
                            {companySlogan}
                        </p>
                    </div>
                </div>

                {/* Lado derecho: Imagen de fondo corporativa con degradado Blue Fantastic */}
                <div className="absolute sm:relative inset-0 sm:inset-auto sm:w-1/2 h-full z-0 opacity-40 sm:opacity-100">
                    <img
                        src={bannerImageUrl}
                        alt="Corporate Banner Background"
                        className="h-full w-full object-cover"
                    />
                    {/* Degradado oficial con #2C3B40 (Blue Fantastic) y #182632 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#182632] via-[#2C3B40]/50 to-transparent hidden sm:block" />
                </div>
            </div>
        </div>
    );
}