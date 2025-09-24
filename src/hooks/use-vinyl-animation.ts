'use client';

import { useState, useCallback } from 'react';

export interface VinylAnimationState {
  isAnimating: boolean;
  isComplete: boolean;
  shouldShowToast: boolean;
}

export function useVinylAnimation() {
  const [state, setState] = useState<VinylAnimationState>({
    isAnimating: false,
    isComplete: false,
    shouldShowToast: false,
  });

  const startAnimation = useCallback(() => {
    setState({
      isAnimating: true,
      isComplete: false,
      shouldShowToast: false,
    });
  }, []);

  const completeAnimation = useCallback(() => {
    setState({
      isAnimating: false,
      isComplete: true,
      shouldShowToast: true,
    });
  }, []);

  const resetAnimation = useCallback(() => {
    setState({
      isAnimating: false,
      isComplete: false,
      shouldShowToast: false,
    });
  }, []);

  const hideToast = useCallback(() => {
    setState(prev => ({
      ...prev,
      shouldShowToast: false,
    }));
  }, []);

  return {
    ...state,
    startAnimation,
    completeAnimation,
    resetAnimation,
    hideToast,
  };
}