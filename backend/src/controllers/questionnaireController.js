import * as questionnaireService from "../services/questionnaireService.js";

export const submitQuestionnaire = async (req, res) => {
  try {
    const data = await questionnaireService.submitQuestionnaire(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuestionnaireByChild = async (req, res) => {
  try {
    const data = await questionnaireService.getQuestionnaireByChild(req.params.childId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
