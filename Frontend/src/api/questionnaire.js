import api from "./axios";

// Questionnaire API calls
export const submitQuestionnaire = async (userId, questions) => {
  try {
    const response = await api.post("/questionnaire/submit", {
      user_id: userId,
      questions: questions
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    throw error;
  }
};

export const getQuestionnaireHistory = async (userId) => {
  try {
    const response = await api.get(`/questionnaire/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questionnaire history:", error);
    throw error;
  }
};

export const getLatestResponse = async (userId) => {
  try {
    const response = await api.get(`/questionnaire/latest/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching latest response:", error);
    throw error;
  }
};
