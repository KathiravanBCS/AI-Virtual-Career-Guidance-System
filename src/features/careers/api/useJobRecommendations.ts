import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface JobApplyOption {
  publisher: string;
  apply_link: string;
  is_direct: boolean;
}

export interface JobHighlights {
  Qualifications?: string[];
  Responsibilities?: string[];
  Benefits?: string[];
}

export interface Job {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  employer_website: string | null;
  job_title: string;
  job_apply_link: string;
  job_description: string;
  job_is_remote: boolean;
  job_posted_human_readable: string;
  job_location: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_salary: number | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_period: string | null;
  job_benefits: string[];
  job_highlights: JobHighlights;
  apply_options: JobApplyOption[];
}

export interface JobSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    date_posted: string;
    country: string;
    language: string;
  };
  data: Job[];
}

interface UseJobRecommendationsOptions {
  query: string;
  page?: number;
  num_pages?: number;
  country?: string;
  date_posted?: string;
}

const JSEARCH_API_KEY = '4048fbad9cmshaf40cdbd71f7631p158a1cjsnebe8a1033bef';
const JSEARCH_API_HOST = 'jsearch.p.rapidapi.com';

export function useJobRecommendations(options: UseJobRecommendationsOptions) {
  const { query, page = 1, num_pages = 1, country = 'us', date_posted = 'all' } = options;

  return useQuery<JobSearchResponse, Error>({
    queryKey: ['job-recommendations', query, page, country, date_posted],
    queryFn: async () => {
      const url = new URL(`https://${JSEARCH_API_HOST}/search`);
      url.searchParams.append('query', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('num_pages', num_pages.toString());
      url.searchParams.append('country', country);
      url.searchParams.append('date_posted', date_posted);

      const response = await axios.get<JobSearchResponse>(url.toString(), {
        headers: {
          'x-rapidapi-key': JSEARCH_API_KEY,
          'x-rapidapi-host': JSEARCH_API_HOST,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    },
    enabled: !!query,
  });
}
