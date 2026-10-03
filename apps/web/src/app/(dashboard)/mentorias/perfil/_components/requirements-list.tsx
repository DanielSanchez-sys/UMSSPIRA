import { CheckIcon, CircleAlertIcon, CircleCheckIcon, ClockIcon, ListChecksIcon } from 'lucide-react';
import type { Requirements } from '@umsspira/shared-types';
import { activationConditions } from './activation-conditions';

export function RequirementsList({ requirements }: { requirements: Requirements }) {
  const total = activationConditions.length;
  const metCount = activationConditions.filter((condition) => requirements[condition.id]).length;
  const eligible = metCount === total;

  return (
    <div className="rounded-lg border border-oatmeal/70 bg-palladian/40 p-4 sm:p-5">
      <div className="flex flex-col items-stretch justify-between gap-3 border-b border-oatmeal/60 pb-4 sm:flex-row sm:items-center">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
          <ListChecksIcon className="h-5 w-5 text-navy" aria-hidden="true" />
          Requisitos para la activación
        </h3>
        <span
          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-center text-[12px] font-semibold ${eligible ? 'bg-success/10 text-success' : 'bg-flame/20 text-truffle-dark'}`}
        >
          {eligible ? <CircleCheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <CircleAlertIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          {metCount} de {total} requisitos cumplidos
        </span>
      </div>

      <p className="mt-4 text-sm leading-[22px] text-ink/75">
        Para habilitar tu rol como mentor, el sistema verifica automáticamente los siguientes requisitos:
      </p>

      <ol className="mt-3 space-y-2">
        {activationConditions.map((condition, index) => {
          const met = requirements[condition.id];
          const Icon = condition.icon;

          return (
            <li
              key={condition.id}
              className={`flex flex-col items-start gap-3 rounded-lg border bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 ${met ? 'border-oatmeal/60' : 'border-flame'}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${met ? 'bg-success/10 text-success' : 'bg-flame/20 text-truffle'}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-5 text-ink">
                  {index + 1}. {condition.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-[18px] text-ink/65">
                  {met ? condition.metDescription : condition.pendingDescription}
                </p>
              </div>
              <span
                className={`inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-md px-2.5 py-1 text-center text-[12px] font-semibold sm:w-auto ${met ? 'bg-success/10 text-success' : 'border border-flame bg-flame/20 text-truffle-dark'}`}
              >
                {met ? <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> : <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />}
                {met ? condition.metStatus : condition.pendingStatus}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
