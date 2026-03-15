export interface JobData {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo: string | null;
  job_location: string;
  job_employment_type: string;
  job_description: string;
  job_apply_link: string;
  job_salary_min: number | null;
  job_salary_max: number | null;
  job_salary_currency: string | null;
  job_benefits: string[];
  job_posted_human_readable: string;
  job_is_remote: boolean;
}

export interface JobSearchResponse {
  status: string;
  data: JobData[];
}

export const searchJobs = async (query: string, location: string = 'us'): Promise<JobSearchResponse> => {
  const encodedQuery = encodeURIComponent(`${query} jobs in ${location}`);
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodedQuery}&page=1&num_pages=1&country=${location}&date_posted=all`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_JSEARCH_API_KEY || '',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
