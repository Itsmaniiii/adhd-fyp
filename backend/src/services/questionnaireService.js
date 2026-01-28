import * as questionnaireRepo from "../repositories/questionnaireRepository.js";

export const submitQuestionnaire = async (payload) => {
  const records = payload.questions.map(q => ({
    child_id: payload.child_id,
    question: q.question,
    answer: q.answer,
    // id removed — DB auto-generate karega
  }));

  return await questionnaireRepo.insertResponses(records);
};

export const getQuestionnaireByChild = async (childId) => {
  return await questionnaireRepo.getQuestionnaireByChild(childId);
};
