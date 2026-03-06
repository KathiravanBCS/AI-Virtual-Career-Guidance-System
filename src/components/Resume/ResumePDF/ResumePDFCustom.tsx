import { Fragment } from 'react';

import { View } from '@react-pdf/renderer';

import { ResumePDFBulletList, ResumePDFSection } from '@/components/Resume/ResumePDF/common';
import { styles } from '@/components/Resume/ResumePDF/styles';
import type { ResumeCustom } from '@/lib/types';

export const ResumePDFCustom = ({
  custom,
  themeColor,
  showBulletPoints,
}: {
  custom: ResumeCustom;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  const sections = custom?.sections || [];

  return (
    <Fragment>
      {sections.map((section, idx) => (
        <ResumePDFSection key={idx} themeColor={themeColor} heading={section.title}>
          <View style={{ ...styles.flexCol }}>
            <ResumePDFBulletList items={section.descriptions} showBulletPoints={showBulletPoints} />
          </View>
        </ResumePDFSection>
      ))}
    </Fragment>
  );
};
