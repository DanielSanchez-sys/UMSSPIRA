import type { AffinityVectorResponse } from '@umsspira/shared-types/src/affinity';
import { apiClient } from './api-client';
import affinityVectorMock from '../mocks/affinity-vector-mock.json';

const AFFINITY_ENDPOINT = '/affinity/me';
const AFFINITY_CALCULATE_ENDPOINT = '/affinity/calculate';
// Por defecto se usa el mock a menos que explícitamente se desactive con 'false'
const USE_AFFINITY_MOCK = process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK !== 'false';

/**
 * Obtiene el vector de afinidad actual del graduado.
 *
 * @returns Promesa con los datos del vector de afinidad.
 */
export async function getAffinityVector(): Promise<AffinityVectorResponse> {
  if (USE_AFFINITY_MOCK) {
    return affinityVectorMock as AffinityVectorResponse;
  }
  return apiClient.get<AffinityVectorResponse>(AFFINITY_ENDPOINT);
}

/**
 * Solicita el cálculo del vector de afinidad del graduado.
 *
 * @returns Promesa con los datos del vector de afinidad calculado.
 */
export async function calculateAffinityVector(): Promise<AffinityVectorResponse> {
  if (USE_AFFINITY_MOCK) {
    // Simula retardo de red de 1 segundo para apreciar el spinner de carga
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      ...affinityVectorMock,
      calculatedAt: new Date().toISOString(),
    } as AffinityVectorResponse;
  }

  return apiClient.post<AffinityVectorResponse>(AFFINITY_CALCULATE_ENDPOINT, {});
}