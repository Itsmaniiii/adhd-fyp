import * as questionnaireRepo from "../repositories/questionnaireRepository.js";

export const submitQuestionnaire = async (payload) => {
  try {
    // Save responses to database
    const records = payload.questions.map(q => ({
      user_id: payload.user_id,
      question: q.question,
      answer: q.answer, // Save the answer value (string)
      score: parseInt(q.score) || 0 // Save the calculated score as integer
    }));

    const savedResponses = await questionnaireRepo.insertResponses(records);

    return {
      success: true,
      message: "Questionnaire submitted successfully",
      responses: savedResponses
    };
  } catch (err) {
    throw new Error(`Failed to submit questionnaire: ${err.message}`);
  }
};

export const getQuestionnaireByUser = async (userId) => {
  return await questionnaireRepo.getQuestionnaireByUser(userId);
};
