import { useQuery } from '@tanstack/react-query';

import { Assessment, CareerPath, UserData } from '../types';

export const useGetCareerSummaryData = () => {
  return useQuery({
    queryKey: ['careerSummaryData'],
    queryFn: async () => {
      // Mock data - replace with actual API calls when backend is ready
      const userData: UserData = {
        name: 'John Doe',
        careerGoal: 'Become a Full Stack Developer',
        interests: ['Web Development', 'Machine Learning', 'Cloud Computing'],
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      };

      const careerPaths: CareerPath[] = [
        {
          $id: '1',
          careerName: 'Full Stack Development',
          modules: ['Module 1', 'Module 2', 'Module 3'],
          completedModules: ['Module 1', 'Module 2'],
          progress: 65,
          recommendedSkills: ['JavaScript', 'React', 'Node.js'],
        },
        {
          $id: '2',
          careerName: 'Data Science',
          modules: ['Module 1', 'Module 2', 'Module 3', 'Module 4'],
          completedModules: ['Module 1'],
          progress: 25,
          recommendedSkills: ['Python', 'SQL', 'Machine Learning'],
        },
      ];

      const assessments: Assessment[] = [
        {
          moduleID: '1',
          moduleName: 'JavaScript Basics',
          score: 85,
          feedback: 'Accuracy: 85%',
        },
        {
          moduleID: '2',
          moduleName: 'React Fundamentals',
          score: 78,
          feedback: 'Accuracy: 78%',
        },
      ];

      return {
        user: userData,
        paths: careerPaths,
        assessments,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};
