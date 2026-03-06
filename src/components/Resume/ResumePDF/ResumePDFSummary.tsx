import { Text, View } from '@react-pdf/renderer';

import { ResumePDFSection } from '@/components/Resume/ResumePDF/common';
import { styles } from '@/components/Resume/ResumePDF/styles';
import type { ResumeSummary } from '@/lib/types';

export const ResumePDFSummary = ({ summary, themeColor }: { summary: ResumeSummary; themeColor: string }) => {
  const { content } = summary;

  if (!content || content.trim() === '') {
    return null;
  }

  return (
    <ResumePDFSection themeColor={themeColor} heading="PROFESSIONAL SUMMARY">
      <View style={{ ...styles.flexCol }}>
        <Text style={{ ...styles.text, lineHeight: 1.5 }}>{content}</Text>
      </View>
    </ResumePDFSection>
  );
};
