/**
 * Service for saving complete career guidance analysis
 * Follows the exact backend API specification from CAREER_GUIDANCE_ENDPOINTS.md
 */

import { api } from '@/lib/api';
import type {
  AICareerGuidance,
  CreateCareerGuidanceRequest,
  CreateCareerRequest,
  CreateCareerSkillRequest,
  CreateCareerCompanyRequest,
  CreateRecommendationRequest,
  CreateJobMarketTrendRequest,
} from '../types';

interface SaveAnalysisResult {
  success: boolean;
  careerGuidanceId?: number;
  careersCreated?: number;
  skillsCreated?: number;
  companiesCreated?: number;
  recommendationsCreated?: number;
  trendsCreated?: number;
  errors?: string[];
}

export async function saveCareerAnalysis(data: AICareerGuidance): Promise<SaveAnalysisResult> {
  const result: SaveAnalysisResult = {
    success: false,
    errors: [],
  };

  try {
    // STEP 1: Create Career Guidance (parent record)
    console.log('[SaveService] Step 1: Creating career guidance...');
    const guidanceData: CreateCareerGuidanceRequest = {
      user_id: 1, // TODO: Get from auth context
      current_skills: data.userInterests.skills || [],
      interests: data.userInterests.interests || [],
      experience: data.userInterests.experience || '',
      career_goals: data.userInterests.goals || '',
      guidance: data.guidance,
      summary: data.summary,
      status: 'active',
    };

    const guidanceResponse = await api.careerGuidance.create(guidanceData);
    // The API client unwraps the response, so guidanceResponse is the CareerGuidance object directly
    const careerGuidanceId = (guidanceResponse as any)?.id;

    if (!careerGuidanceId) {
      console.error('[SaveService] Response structure:', guidanceResponse);
      throw new Error('Career guidance creation failed - no ID returned');
    }

    result.careerGuidanceId = careerGuidanceId;
    console.log('[SaveService] ✓ Career guidance created:', careerGuidanceId);

    // STEP 2: Create Careers
    console.log('[SaveService] Step 2: Creating careers...');
    result.careersCreated = 0;

    for (const career of data.recommendedCareers) {
      try {
        const careerData: CreateCareerRequest = {
          career_guidance_id: careerGuidanceId,
          career_title: career.careerTitle,
          description: career.description || '',
          job_responsibilities: career.jobResponsibilities || '',
          career_growth_path: career.careerGrowthPath || '',
          industry: career.industry || '',
          salary_min: career.salaryMin || 0,
          salary_max: career.salaryMax || 0,
          salary_currency: career.salaryCurrency || 'USD',
          demand_level: career.demandLevel || '',
          job_market_demand_score: career.jobMarketDemandScore || career.matchScore || 0,
          growth_rate: career.growthRate || 0,
          status: 'active',
        };

        await api.careers.create(careerData);
        result.careersCreated!++;
        console.log(`[SaveService] ✓ Career created: ${career.careerTitle}`);
      } catch (err) {
        const errorMsg = `Error creating career "${career.careerTitle}": ${err instanceof Error ? err.message : String(err)}`;
        result.errors?.push(errorMsg);
        console.error('[SaveService]', errorMsg);
      }
    }

    // STEP 3: Create Career Skills
    console.log('[SaveService] Step 3: Creating career skills...');
    result.skillsCreated = 0;

    for (const skill of data.skills) {
      try {
        const skillData: CreateCareerSkillRequest = {
          career_guidance_id: careerGuidanceId,
          skill_name: skill.skillName,
          importance_level: skill.importanceLevel,
          proficiency_required: skill.proficiencyRequired,
          learning_path: skill.learningPath || '',
        };

        await api.careerSkills.create(skillData);
        result.skillsCreated!++;
        console.log(`[SaveService] ✓ Skill created: ${skill.skillName}`);
      } catch (err) {
        const errorMsg = `Error creating skill "${skill.skillName}": ${err instanceof Error ? err.message : String(err)}`;
        result.errors?.push(errorMsg);
        console.error('[SaveService]', errorMsg);
      }
    }

    // STEP 4: Create Career Companies
    console.log('[SaveService] Step 4: Creating career companies...');
    result.companiesCreated = 0;

    for (const company of data.companies) {
      try {
        const companyData: CreateCareerCompanyRequest = {
          career_guidance_id: careerGuidanceId,
          company_name: company.companyName,
          industry: company.industry,
          hiring_level: company.hiringLevel,
          job_market_opportunity: company.jobMarketOpportunity || '',
        };

        await api.careerCompanies.create(companyData);
        result.companiesCreated!++;
        console.log(`[SaveService] ✓ Company created: ${company.companyName}`);
      } catch (err) {
        const errorMsg = `Error creating company "${company.companyName}": ${err instanceof Error ? err.message : String(err)}`;
        result.errors?.push(errorMsg);
        console.error('[SaveService]', errorMsg);
      }
    }

    // STEP 5: Create Recommendations
    console.log('[SaveService] Step 5: Creating recommendations...');
    result.recommendationsCreated = 0;

    for (const rec of data.recommendations) {
      try {
        const recommendationData: CreateRecommendationRequest = {
          career_guidance_id: careerGuidanceId,
          user_id: 1, // TODO: Get from auth context
          career_title: rec.careerTitle,
          match_score: rec.matchScore,
          personality_alignment: rec.personalityAlignment,
          skill_alignment: rec.skillAlignment,
          interest_alignment: rec.interestAlignment,
          rank: data.recommendations.indexOf(rec) + 1,
          reasoning: rec.reasoning,
          next_steps: rec.nextSteps || [],
          status: 'active',
        };

        await api.recommendations.create(recommendationData);
        result.recommendationsCreated!++;
        console.log(`[SaveService] ✓ Recommendation created: ${rec.careerTitle}`);
      } catch (err) {
        const errorMsg = `Error creating recommendation "${rec.careerTitle}": ${err instanceof Error ? err.message : String(err)}`;
        result.errors?.push(errorMsg);
        console.error('[SaveService]', errorMsg);
      }
    }

    // STEP 6: Create Market Trends
    console.log('[SaveService] Step 6: Creating market trends...');
    result.trendsCreated = 0;

    for (const trend of data.marketTrends) {
      try {
        const trendData: CreateJobMarketTrendRequest = {
          career_guidance_id: careerGuidanceId,
          trend_name: trend.trendName,
          career_title: trend.careerTitle,
          trend_description: trend.trendDescription,
          impact_level: trend.impactLevel,
          current_data: trend.currentData,
          forecast: trend.forecast,
          growth_potential: trend.growthPotential,
          in_demand_skills: trend.inDemandSkills || [],
        };

        await api.jobMarketTrends.create(trendData);
        result.trendsCreated!++;
        console.log(`[SaveService] ✓ Trend created: ${trend.trendName}`);
      } catch (err) {
        const errorMsg = `Error creating trend "${trend.trendName}": ${err instanceof Error ? err.message : String(err)}`;
        result.errors?.push(errorMsg);
        console.error('[SaveService]', errorMsg);
      }
    }

    result.success = true;
    console.log('[SaveService] ✓ All data saved successfully!', result);

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    result.errors?.push(errorMsg);
    console.error('[SaveService] Fatal error:', errorMsg);
    return result;
  }
}
