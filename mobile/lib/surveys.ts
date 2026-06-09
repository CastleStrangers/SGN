import { apiFetch } from "./api";

export async function getActiveSurvey(): Promise<any> {
  const surveys = await apiFetch("/surveys?active=true");
  return surveys?.[0] || null;
}

export async function voteSurvey(surveyId: string, optionId: string): Promise<any> {
  return apiFetch("/surveys/vote", {
    method: "POST",
    body: JSON.stringify({ surveyId, optionId }),
  });
}

export async function getSurveyResults(surveyId: string): Promise<any> {
  return apiFetch(`/surveys/results?surveyId=${surveyId}`);
}
