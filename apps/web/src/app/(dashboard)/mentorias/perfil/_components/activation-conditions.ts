import { BadgeCheckIcon, ContactIcon, ShieldCheckIcon } from 'lucide-react';
import type { ConditionId } from '@umsspira/shared-types';

export const activationConditions = [
  {
    id: 'egresado' as ConditionId,
    icon: BadgeCheckIcon,
    title: 'Condición de titulado aprobado',
    metDescription: 'Tu condición de titulado está aprobada en la plataforma.',
    pendingDescription: 'Tu condición de titulado aún está pendiente de aprobación.',
    metStatus: 'Aprobado',
    pendingStatus: 'Pendiente de aprobación',
  },
  {
    id: 'perfil' as ConditionId,
    icon: ContactIcon,
    title: 'Perfil mínimo completo',
    metDescription: 'Tu perfil cuenta con la información mínima requerida.',
    pendingDescription: 'Tu perfil aún no cuenta con la información mínima requerida.',
    metStatus: 'Completo',
    pendingStatus: 'Incompleto',
  },
  {
    id: 'sinRestricciones' as ConditionId,
    icon: ShieldCheckIcon,
    title: 'Sin restricciones de participación',
    metDescription: 'No tienes restricciones para participar como mentor en la red.',
    pendingDescription: 'Debes confirmar que no existen restricciones para participar como mentor.',
    metStatus: 'Sin restricciones',
    pendingStatus: 'Con restricciones',
  },
];
