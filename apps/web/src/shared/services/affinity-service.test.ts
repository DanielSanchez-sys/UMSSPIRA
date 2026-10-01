/// <reference types="jest" />
const AREAS_ORDER = [
  'software-development',
  'cloud-devops',
  'data-ai',
  'quality-assurance',
  'cybersecurity-networks',
  'it-management',
];

describe('getAffinityVector', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // La variable se lee al cargar el módulo, por eso se reinicia el registro
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('devuelve el mock con 6 áreas en orden fijo y valores entre 0 y 100', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'true';
    const { getAffinityVector } = await import('./affinity-service');

    const result = await getAffinityVector();

    expect(result.areas.map((item) => item.area)).toEqual(AREAS_ORDER);
    result.areas.forEach((item) => {
      expect(item.affinity).toBeGreaterThanOrEqual(0);
      expect(item.affinity).toBeLessThanOrEqual(100);
    });
  });

  it('consulta el endpoint real cuando el mock está desactivado', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'false';
    const payload = { graduateId: 'id-1', calculatedAt: '2026-09-28T12:00:00.000Z', areas: [] };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => payload });
    const { getAffinityVector } = await import('./affinity-service');

    const result = await getAffinityVector();

    expect(result).toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/affinity/me'),
      expect.anything(),
    );
  });

  it('lanza error con el estado HTTP cuando el backend responde con fallo', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'false';
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    const { getAffinityVector } = await import('./affinity-service');

    await expect(getAffinityVector()).rejects.toMatchObject({ status: 500 });
  });
});