import type { MentorState } from '@umsspira/shared-types';

/**
 * Estado inicial simulado (HU 6.1).
 * Para probar el estado bloqueado pon `egresado`, `perfil` o `sinRestricciones` en false.
 */
export const initialMentorState: MentorState = {
  isActive: false,
  requirements: { egresado: true, perfil: true, sinRestricciones: true },
};
