import { useState, useCallback } from 'react';
import type { AffinityVectorResponse } from '@umsspira/shared-types/src/affinity';
import { calculateAffinityVector } from '../services/affinity-service';

export interface UseAffinityCalculationReturn {
  data: AffinityVectorResponse | null;
  isLoading: boolean;
  error: string | null;
  calculate: (shouldFail?: boolean) => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

export function useAffinityCalculation(): UseAffinityCalculationReturn {
  const [data, setData] = useState<AffinityVectorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastShouldFail, setLastShouldFail] = useState<boolean>(false);

  const calculate = useCallback(async (shouldFail = false) => {
    setIsLoading(true);
    setError(null);
    setLastShouldFail(shouldFail);

    try {
      const response = await calculateAffinityVector(shouldFail);
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ocurrió un error inesperado al calcular la afinidad.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const retry = useCallback(async () => {
    await calculate(lastShouldFail);
  }, [calculate, lastShouldFail]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    calculate,
    retry,
    reset,
  };
}
