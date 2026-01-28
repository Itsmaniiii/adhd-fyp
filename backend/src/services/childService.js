import * as childRepo from "../repositories/childRepository.js";
import { v4 as uuidv4 } from "uuid";

export const createChild = async (userId, payload) => {
  const childData = {
    user_id: userId,
    ...payload, // name, age
  };

  return await childRepo.createChild(childData);
};


export const getChildByUser = async (userId) => {
  return await childRepo.getChildByUser(userId);
};
