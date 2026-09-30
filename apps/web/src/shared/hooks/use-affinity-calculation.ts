import { useState, useCallback } from 'react';
import type { AffinityVectorResponse } from '@umsspira/shared-types/src/affinity';
import { calculateAffinityVector } from '../services/affinity-service';

/**
 * Interface representing the state and methods returned by useAffinityCalculation.
 */
export interface UseAffinityCalculationReturn {
  data: AffinityVectorResponse | null;
  isLoading: boolean;
  error: string | null;
  calculate: () => Promise<void>;
  retry: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom React hook for managing affinity vector calculation state, including loading and error handling.
 */
export function useAffinityCalculation(): UseAffinityCalculationReturn {
  const [data, setData] = useState<AffinityVectorResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await calculateAffinityVector();
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
    await calculate();
  }, [calculate]);

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
