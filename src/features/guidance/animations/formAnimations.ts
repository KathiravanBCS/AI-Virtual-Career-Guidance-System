import type { Variants } from 'framer-motion';

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const stepContentVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.15 },
  },
};

export const loadingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.06, 1],
    opacity: [1, 0.75, 1],
    transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 3, repeat: Infinity, ease: 'linear' },
  },
};

export const progressVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const alertVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25 },
  },
};

export const buttonVariants: Variants = {
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const stepperStepVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: index * 0.08, duration: 0.35 },
  }),
};

export const inputFocusVariants: Variants = {
  blur: { scale: 1, transition: { duration: 0.2 } },
  focus: { scale: 1.01, transition: { duration: 0.2 } },
};

export const cardHoverVariants: Variants = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: {
    scale: 1.015,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

export const formSectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 0.9, repeat: Infinity, ease: 'linear' },
  },
};

export const floatVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const successVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 220, damping: 12 },
  },
};

export const bounceVariants: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [-8, 0],
    transition: { type: 'spring', stiffness: 320, damping: 12 },
  },
};