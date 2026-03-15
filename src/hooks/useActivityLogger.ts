import { useCallback } from 'react';
import type {
  LogActivityRequest,
  LogActivityResponse,
  ActivityType,
  ReferenceType,
} from '@/features/gamification/types';
import { api } from '@/lib/api';

interface UseActivityLoggerOptions {
  showNotification?: (points: number, message: string) => void;
  onError?: (error: string) => void;
}

interface UseActivityLoggerReturn {
  logActivity: (
    activityType: ActivityType,
    referenceId: number,
    referenceType: ReferenceType,
    metadata?: Record<string, any>
  ) => Promise<LogActivityResponse | null>;
  logModuleComplete: (moduleId: number) => Promise<LogActivityResponse | null>;
  logQuizPass: (quizId: number, score?: number) => Promise<LogActivityResponse | null>;
  logQuizAttempt: (quizId: number) => Promise<LogActivityResponse | null>;
  logFlashcardRead: (flashcardId: number) => Promise<LogActivityResponse | null>;
  logFlashcardSetComplete: (flashcardId: number) => Promise<LogActivityResponse | null>;
  logDailyLogin: () => Promise<LogActivityResponse | null>;
  logAssessmentComplete: (assessmentId: number) => Promise<LogActivityResponse | null>;
}

export const useActivityLogger = ({
  showNotification,
  onError,
}: UseActivityLoggerOptions = {}): UseActivityLoggerReturn => {
  // Generic activity logger
  const logActivity = useCallback(
    async (
      activityType: ActivityType,
      referenceId: number,
      referenceType: ReferenceType,
      metadata?: Record<string, any>
    ): Promise<LogActivityResponse | null> => {
      try {
        const request: LogActivityRequest = {
          activity_type: activityType,
          reference_id: referenceId,
          reference_type: referenceType,
          activity_metadata: metadata,
        };

        const response = await api.gamification.activities.log(request);

        if (response && showNotification) {
          showNotification(
            response.points_earned,
            `Great! You earned ${response.points_earned} points!`
          );
        }

        return response;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to log activity';
        console.error('[useActivityLogger] Error logging activity:', error);
        if (onError) {
          onError(errorMsg);
        }
        return null;
      }
    },
    [showNotification, onError]
  );

  // Specific loggers
  const logModuleComplete = useCallback(
    (moduleId: number) =>
      logActivity('module_complete', moduleId, 'learning_module'),
    [logActivity]
  );

  const logQuizPass = useCallback(
    (quizId: number, score?: number) =>
      logActivity('quiz_pass', quizId, 'quiz', { score }),
    [logActivity]
  );

  const logQuizAttempt = useCallback(
    (quizId: number) =>
      logActivity('quiz_attempt', quizId, 'quiz'),
    [logActivity]
  );

  const logFlashcardRead = useCallback(
    (flashcardId: number) =>
      logActivity('flashcard_read', flashcardId, 'flashcard'),
    [logActivity]
  );

  const logFlashcardSetComplete = useCallback(
    (flashcardId: number) =>
      logActivity('flashcard_set_complete', flashcardId, 'flashcard'),
    [logActivity]
  );

  const logDailyLogin = useCallback(
    () => logActivity('daily_login', 0, 'user'),
    [logActivity]
  );

  const logAssessmentComplete = useCallback(
    (assessmentId: number) =>
      logActivity('assessment_complete', assessmentId, 'assessment'),
    [logActivity]
  );

  return {
    logActivity,
    logModuleComplete,
    logQuizPass,
    logQuizAttempt,
    logFlashcardRead,
    logFlashcardSetComplete,
    logDailyLogin,
    logAssessmentComplete,
  };
};

export default useActivityLogger;
