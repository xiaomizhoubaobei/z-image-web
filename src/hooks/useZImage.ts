// React Hook for Z-Image API integration
import { useState, useCallback } from 'react';
import { zImageAPI, GenerateRequest, GenerateResponse, EditRequest } from '../services/api';

export interface UseZImageOptions {
  onSuccess?: (response: GenerateResponse) => void;
  onError?: (error: string) => void;
}

export function useZImage(options: UseZImageOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (request: GenerateRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await zImageAPI.generateImage(request);
      setLastResponse(response);
      
      if (response.success) {
        options.onSuccess?.(response);
      } else {
        const errorMessage = response.error || '生成失败';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      return {
        success: false,
        images: [],
        generation_time: 0,
        model_used: request.model,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const editImage = useCallback(async (request: EditRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await zImageAPI.editImage(request);
      setLastResponse(response);
      
      if (response.success) {
        options.onSuccess?.(response);
      } else {
        const errorMessage = response.error || '编辑失败';
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      options.onError?.(errorMessage);
      
      return {
        success: false,
        images: [],
        generation_time: 0,
        model_used: request.model,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setLastResponse(null);
    setError(null);
  }, []);

  return {
    generateImage,
    editImage,
    isLoading,
    lastResponse,
    error,
    clearError,
    reset,
  };
}