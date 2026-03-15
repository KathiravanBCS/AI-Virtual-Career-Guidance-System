'use client';

import { useMemo } from 'react';

import { PDFViewer } from '@react-pdf/renderer';
import Frame from 'react-frame-component';

import { getAllFontFamiliesToLoad } from '@/components/fonts/lib';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PT,
  A4_WIDTH_PX,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PT,
  LETTER_WIDTH_PX,
} from '@/lib/constants';

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const allFontFamilies = getAllFontFamiliesToLoad();

  const allFontFamiliesPreloadLinks = allFontFamilies
    .map(
      (
        font
      ) => `<link rel="preload" as="font" href="/fonts/${font}-Regular.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="/fonts/${font}-Bold.ttf" type="font/ttf" crossorigin="anonymous">`
    )
    .join('');

  const allFontFamiliesFontFaces = allFontFamilies
    .map(
      (font) => `@font-face {font-family: "${font}"; src: url("/fonts/${font}-Regular.ttf");}
@font-face {font-family: "${font}"; src: url("/fonts/${font}-Bold.ttf"); font-weight: bold;}`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
  <head>
    ${allFontFamiliesPreloadLinks}
    <style>
      ${allFontFamiliesFontFaces}
    </style>
  </head>
  <body style='overflow: hidden; width: ${width}pt; margin: 0; padding: 0; -webkit-text-size-adjust:none;'>
    <div></div>
  </body>
</html>`;
};

/**
 * Iframe-based resume renderer with optional PDFViewer support.
 *
 * By default, uses iframe for style isolation (since react-pdf uses pt units).
 * When enablePDFViewer is true, renders with PDFViewer for real A4 page boundaries
 * and automatic page breaks. Uses debouncing to prevent excessive re-renders.
 */
const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
  hideScrollbar = false,
  debounceDelay = 500,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
  hideScrollbar?: boolean;
  debounceDelay?: number;
}) => {
  const isA4 = documentSize === 'A4';
  const iframeInitialContent = useMemo(() => getIframeInitialContent(isA4), [isA4]);

  // Debounce children to prevent excessive PDFViewer re-renders on every keystroke
  // Default 250ms provides good balance between responsiveness and performance
  const debouncedChildren = useDebouncedValue(children, debounceDelay ?? 250);

  if (enablePDFViewer) {
    const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
    const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          height: '100%',
          padding: '0',
          margin: '0',
        }}
      >
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            flexShrink: 0,
          }}
        >
          <DynamicPDFViewer width={`${width}px`} height={`${height}px`} showToolbar={false}>
            {debouncedChildren as any}
          </DynamicPDFViewer>
        </div>
      </div>
    );
  }
  const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        minHeight: '100%',
        overflow: hideScrollbar ? 'hidden' : 'auto',
        padding: '0',
        margin: '0',
      }}
    >
      {/* There is an outer div and an inner div here. The inner div sets the iframe width and uses transform scale to zoom in/out the resume iframe.
        While zooming out or scaling down via transform, the element appears smaller but still occupies the same width/height. Therefore, we use the 
        outer div to restrict the max width & height proportionally */}
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}
        className={`bg-white shadow-lg`}
      >
        <Frame
          style={{ width: '100%', height: '100%', backgroundColor: 'white' }}
          initialContent={iframeInitialContent}
          // key is used to force component to re-mount when document size changes
          key={isA4 ? 'A4' : 'LETTER'}
        >
          {children}
        </Frame>
      </div>
    </div>
  );
};

export const ResumeIframeCSR = ResumeIframe;

const DynamicPDFViewer = PDFViewer;
