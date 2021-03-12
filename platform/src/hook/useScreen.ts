import { useMediaQuery } from 'react-responsive';
import { MediaQueryBreakpoint } from 'ui-boom-components/lib';

type ScreenSize = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
};

export const useScreen = (): ScreenSize => {
  const isMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px)` });
  const isTablet = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });
  const isDesktop = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Desktop}px)` });
  const isLargeDesktop = useMediaQuery({ query: `screen and (min-width: ${MediaQueryBreakpoint.Large}px)` });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  };
};
