export interface UserProfile {
  name: string;
  email: string;
  careerGoal: string;
  interests: string[];
  skills: string[];
  bio?: string;
  profileImage?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  careerGoal: string;
  interests: string[];
  skills: string[];
  bio?: string;
}
