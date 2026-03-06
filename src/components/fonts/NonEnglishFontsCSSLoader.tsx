import { lazy, Suspense, useEffect, useState } from 'react';

import { getAllFontFamiliesToLoad } from '@/components/fonts/lib';

const FontsZhCSR = lazy(() => import('@/components/fonts/FontsZh'));

/**
 * Empty component to lazy load non-english fonts CSS conditionally
 *
 * Reference: https://prawira.medium.com/react-conditional-import-conditional-css-import-110cc58e0da6
 */
export const NonEnglishFontsCSSLazyLoader = () => {
  const [shouldLoadFontsZh, setShouldLoadFontsZh] = useState(false);

  useEffect(() => {
    if (getAllFontFamiliesToLoad().includes('NotoSansSC')) {
      setShouldLoadFontsZh(true);
    }
  }, []);

  return (
    <>
      {shouldLoadFontsZh && (
        <Suspense fallback={null}>
          <FontsZhCSR />
        </Suspense>
      )}
    </>
  );
};
