import * as geneticsService from "../services/geneticsService.js";

export const addGenetics = async (req, res) => {
  try {
    const data = await geneticsService.addGenetics(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getGeneticsByChild = async (req, res) => {
  try {
    const data = await geneticsService.getGeneticsByChild(req.params.childId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
