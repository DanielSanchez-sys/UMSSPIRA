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

describe('saveAffinityConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('guarda la configuración exitosamente con mock', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'true';
    const { saveAffinityConfig } = await import('./affinity-service');

    await expect(saveAffinityConfig({ axes: [{ area: 'software-development', weight: 3 }] })).resolves.toBeUndefined();
  });

  it('envía la configuración al endpoint real cuando el mock está desactivado', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'false';
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    const { saveAffinityConfig } = await import('./affinity-service');

    await saveAffinityConfig({ axes: [{ area: 'software-development', weight: 3 }] });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/affinity/config'),
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

describe('getAffinityConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('devuelve los 6 ejes del mock en el orden fijo con ponderaciones enteras', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'true';
    const { getAffinityConfig } = await import('./affinity-service');

    const config = await getAffinityConfig();

    expect(config.axes.map((axis) => axis.area)).toEqual(AREAS_ORDER);
    config.axes.forEach((axis) => {
      expect(Number.isInteger(axis.weight)).toBe(true);
    });
  });

  it('ordena la respuesta del backend según AFFINITY_AREAS', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'false';
    const payload = {
      axes: [
        { area: 'it-management', weight: 2 },
        { area: 'data-ai', weight: 3 },
        { area: 'software-development', weight: 4 },
        { area: 'cybersecurity-networks', weight: 3 },
        { area: 'quality-assurance', weight: 2 },
        { area: 'cloud-devops', weight: 3 },
      ],
    };
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => payload });
    const { getAffinityConfig } = await import('./affinity-service');

    const config = await getAffinityConfig();

    expect(config.axes.map((axis) => axis.area)).toEqual(AREAS_ORDER);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/affinity/config'),
      expect.anything(),
    );
  });
});

describe('recalculateAffinity', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('recalcula exitosamente con mock', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'true';
    const { recalculateAffinity } = await import('./affinity-service');

    const result = await recalculateAffinity();

    expect(result.areas).toHaveLength(6);
    expect(result.calculatedAt).toBeDefined();
  });

  it('lanza error de timeout cuando el servidor tarda más de 7 segundos', async () => {
    process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'false';
    global.fetch = jest.fn().mockImplementation(
      () => new Promise((_, reject) => {
        setTimeout(() => {
          const error = new Error('The operation was aborted');
          error.name = 'AbortError';
          reject(error);
        }, 100);
      }),
    );

    const { recalculateAffinity } = await import('./affinity-service');

    await expect(recalculateAffinity()).rejects.toThrow('No se pudo actualizar, vuelve a intentarlo.');
  });

  it(
    'rota entre los 3 snapshots del mock en cada recálculo',
    async () => {
      process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK = 'true';
      const { recalculateAffinity } = await import('./affinity-service');

      const first = await recalculateAffinity();
      const second = await recalculateAffinity();
      const third = await recalculateAffinity();
      const fourth = await recalculateAffinity();

      [first, second, third].forEach((vector) => {
        expect(vector.areas.map((item) => item.area)).toEqual(AREAS_ORDER);
        vector.areas.forEach((item) => {
          expect(Number.isInteger(item.affinity)).toBe(true);
          expect(item.affinity).toBeGreaterThanOrEqual(0);
          expect(item.affinity).toBeLessThanOrEqual(100);
        });
      });

      expect(JSON.stringify(second.areas)).not.toEqual(JSON.stringify(first.areas));
      expect(JSON.stringify(third.areas)).not.toEqual(JSON.stringify(second.areas));
      expect(JSON.stringify(fourth.areas)).toEqual(JSON.stringify(first.areas));
    },
    15000,
  );
});