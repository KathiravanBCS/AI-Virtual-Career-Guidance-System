import { useEffect, useState } from 'react';

import { useMantineTheme } from '@mantine/core';

export const useTailwindBreakpoints = () => {
  const theme = useMantineTheme();
  const [isSm, setIsSm] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const [isLg, setIsLg] = useState(false);
  const [isXl, setIsXl] = useState(false);
  const [is2xl, setIs2xl] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsSm(screenWidth >= parseInt(theme.breakpoints.sm));
      setIsMd(screenWidth >= parseInt(theme.breakpoints.md));
      setIsLg(screenWidth >= parseInt(theme.breakpoints.lg));
      setIsXl(screenWidth >= parseInt(theme.breakpoints.xl));
      setIs2xl(screenWidth >= parseInt(theme.breakpoints.xs));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  return { isSm, isMd, isLg, isXl, is2xl };
};
