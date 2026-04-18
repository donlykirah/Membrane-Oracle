import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 10) {
      console.warn(`[MLO] ${componentName} rendered ${renderCount.current} times`);
    }
  });
  
  return renderCount.current;
};