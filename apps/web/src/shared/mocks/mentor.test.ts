import { initialMentorState } from './mentor';

describe('initialMentorState', () => {
  it('incluye la condición sinRestricciones en los requisitos', () => {
    expect(initialMentorState.requirements).toMatchObject({
      egresado: true,
      perfil: true,
      sinRestricciones: true,
    });
  });
});
