import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Returns `true` when the viewport is narrower than the configured mobile
 * breakpoint (768px by default). Listens to `matchMedia` and updates on
 * resize. Always returns `false` on first render in SSR.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
