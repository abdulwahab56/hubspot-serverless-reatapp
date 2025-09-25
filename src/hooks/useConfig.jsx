import { useMemo } from 'react';

const useConfig = () => {
  return useMemo(() => {
    if (!window.AUI_CONFIG) {
      console.warn('Config not loaded yet');
      return null;
    }
    return window.AUI_CONFIG;
  }, []);
};

export default useConfig;