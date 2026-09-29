import type { AffinityVectorResponse } from '@umsspira/shared-types/src/affinity';
import { apiClient } from "./api-client";
import affinityVectorMock from "../mocks/affinity-vector-mock.json";

// Ruta pendiente de confirmar con el equipo de backend
const AFFINITY_ENDPOINT = "/affinity/me";
const USE_AFFINITY_MOCK = process.env.NEXT_PUBLIC_USE_AFFINITY_MOCK === "true";

export async function getAffinityVector(): Promise<AffinityVectorResponse> {
  // Mientras el backend no esté listo se usa el mock local
  if (USE_AFFINITY_MOCK) {
    return affinityVectorMock as AffinityVectorResponse;
  }
  return apiClient.get<AffinityVectorResponse>(AFFINITY_ENDPOINT);
}