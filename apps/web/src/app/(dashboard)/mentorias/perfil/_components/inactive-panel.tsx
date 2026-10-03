import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  GraduationCapIcon,
  InfoIcon,
  LockIcon,
  LockOpenIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import type { Requirements } from '@umsspira/shared-types';
import { ApprovedChip } from './approved-chip';
import { StatusBadge } from './status-badge';
import { PrimaryButton, SecondaryButton } from './ui';
import { activationConditions } from './activation-conditions';
import { RequirementsList } from './requirements-list';

interface InactivePanelProps {
  requirements: Requirements;
  activating: boolean;
  onActivate: () => void;
}

export function InactivePanel({ requirements, activating, onActivate }: InactivePanelProps) {
  const total = activationConditions.length;
  const metCount = activationConditions.filter((condition) => requirements[condition.id]).length;
  const eligible = metCount === total;
  const pending = activationConditions.filter((condition) => !requirements[condition.id]);
  const graduatePending = !requirements.egresado;

  return (
    <section aria-labelledby="inactive-title" className="rounded-lg border border-oatmeal/70 bg-white">
      <div className="px-5 pt-5 sm:px-9 sm:pt-7">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-oatmeal/60 pb-4">
          <StatusBadge variant="inactive">Inactivo</StatusBadge>
          <ApprovedChip approved={!graduatePending} />
        </div>

        <div className="mx-auto max-w-xl py-9 text-center">
          <span
            aria-hidden="true"
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${eligible ? 'bg-palladian text-navy' : 'bg-oatmeal/40 text-navy'}`}
          >
            {eligible ? <GraduationCapIcon className="h-7 w-7" /> : <LockIcon className="h-6 w-6" />}
          </span>

          <h2 id="inactive-title" className="mt-5 text-xl font-semibold leading-7 text-ink sm:text-2xl sm:leading-[30px]">
            {eligible ? 'Tu participación como mentor está inactiva' : 'Aún no puedes activar tu participación como mentor'}
          </h2>

          <p className="mt-2 text-[13px] leading-5 text-ink/70">
            {eligible
              ? 'Activa tu participación para comenzar a configurar cómo deseas contribuir en la red de mentorías.'
              : graduatePending
                ? 'Para participar como mentor necesitas contar con la condición de titulado aprobado dentro de UMSSPIRA. Cuando tu estado sea aprobado, podrás volver aquí y activar voluntariamente tu participación.'
                : `Para habilitar la activación deben cumplirse los tres requisitos. ${pending.length === 1 ? 'Revisa el requisito pendiente' : 'Revisa los requisitos pendientes'} a continuación.`}
          </p>
        </div>

        <RequirementsList requirements={requirements} />

        <div className="mt-8 flex gap-3 rounded-lg border border-oatmeal/70 bg-palladian/40 px-4 py-4 sm:px-5">
          {eligible ? (
            <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-truffle" aria-hidden="true" />
          ) : (
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-truffle" aria-hidden="true" />
          )}
          <div className="text-[13px] leading-5 text-ink/75">
            <p className="font-semibold text-ink">{eligible ? 'Requisitos cumplidos' : 'Activación no disponible por ahora'}</p>
            <p className="mt-0.5">
              {eligible
                ? 'Puedes habilitar tu participación cuando lo desees. Activar tu rol de mentor no crea una cuenta nueva ni modifica tu condición de titulado.'
                : 'La opción de activación se habilitará automáticamente cuando los tres requisitos estén cumplidos. Mientras tanto, tu perfil no será visible en la red de mentorías.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-oatmeal/60 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <Link
          href="/mentorias"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-1 text-sm font-semibold text-navy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 sm:justify-start"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Volver a Mentorías
        </Link>

        {eligible ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <span className="inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-success sm:justify-start">
              <LockOpenIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Requisitos cumplidos ({total}/{total})
            </span>
            <PrimaryButton
              iconRight={ArrowRightIcon}
              onClick={onActivate}
              loading={activating}
              loadingLabel="Activando…"
              className="w-full sm:w-auto"
            >
              Activar como mentor
            </PrimaryButton>
          </div>
        ) : (
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <SecondaryButton disabled iconRight={LockIcon} aria-describedby="activation-locked-note" className="w-full sm:w-auto">
              Activar como mentor
            </SecondaryButton>
            <p id="activation-locked-note" className="text-[11px] leading-[14px] text-truffle-dark sm:text-right">
              {pending.length === 1 ? 'Requisito no cumplido' : 'Requisitos no cumplidos'}: {pending.map((condition) => condition.title.toLowerCase()).join(', ')}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
