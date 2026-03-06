import React, { useState } from 'react';

import { Group, TextInput, useMantineTheme } from '@mantine/core';

export const FeaturedSkillInput = ({
  skill,
  rating,
  setSkillRating,
  placeholder,
  className,
  circleColor,
}: {
  skill: string;
  rating: number;
  setSkillRating: (skill: string, rating: number) => void;
  placeholder: string;
  className?: string;
  circleColor?: string;
}) => {
  const theme = useMantineTheme();

  return (
    <Group gap="md" className={className} align="flex-end">
      <TextInput
        style={{ flex: 1 }}
        value={skill}
        placeholder={placeholder}
        onChange={(e) => setSkillRating(e.currentTarget.value, rating)}
        radius="md"
      />
      <CircleRating
        rating={rating}
        setRating={(newRating) => setSkillRating(skill, newRating)}
        circleColor={circleColor}
      />
    </Group>
  );
};

const CircleRating = ({
  rating,
  setRating,
  circleColor = '#38bdf8',
}: {
  rating: number;
  setRating: (rating: number) => void;
  circleColor?: string;
}) => {
  const numCircles = 5;
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const theme = useMantineTheme();

  return (
    <Group gap={4} p={theme.spacing.xs} wrap="nowrap">
      {[...Array(numCircles)].map((_, idx) => (
        <div
          key={idx}
          style={{
            cursor: 'pointer',
            padding: theme.spacing.xs,
          }}
          onClick={() => setRating(idx)}
          onMouseEnter={() => setHoverRating(idx)}
          onMouseLeave={() => setHoverRating(null)}
        >
          <div
            style={{
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '50%',
              backgroundColor:
                (hoverRating !== null && hoverRating >= idx) || (hoverRating === null && rating >= idx)
                  ? circleColor
                  : '#d1d5db',
              transition: 'transform 200ms ease',
              transform:
                (hoverRating !== null && hoverRating >= idx) || (hoverRating === null && rating >= idx)
                  ? 'scale(1.2)'
                  : 'scale(1)',
            }}
          />
        </div>
      ))}
    </Group>
  );
};
