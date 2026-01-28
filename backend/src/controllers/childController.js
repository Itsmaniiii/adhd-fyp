import * as childService from "../services/childService.js";

export const createChild = async (req, res) => {
  try {
    const userId = req.user.id; // JWT se ID
    const data = await childService.createChild(userId, req.body);
    res.status(201).json(data);
  } catch (err) {
    console.log("ERROR IN CONTROLLER:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getChildByUser = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT
    const data = await childService.getChildByUser(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

