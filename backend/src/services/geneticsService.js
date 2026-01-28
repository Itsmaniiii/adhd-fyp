import * as geneticsRepo from "../repositories/geneticsRepository.js";

export const addGenetics = async (payload) => {
  const geneticsData = {
    ...payload, // remove `id: uuidv4()`
  };

  return await geneticsRepo.addGenetics(geneticsData);
};

export const getGeneticsByChild = async (childId) => {
  return await geneticsRepo.getGeneticsByChild(childId);
};
