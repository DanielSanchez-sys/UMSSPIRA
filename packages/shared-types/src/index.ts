export type PingResponse = { status: string; message: string; timestamp: string; };
export * from './company';
export * from './job-posting';

export type ConditionId = 'egresado' | 'perfil' | 'sinRestricciones';
export type Requirements = Record<ConditionId, boolean>;
export interface MentorState {
  isActive: boolean;
  requirements: Requirements;
}
