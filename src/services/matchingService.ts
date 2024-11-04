import { addToQueue, getExistingQueue, findMatch, updateMatch } from "@/repositories/matchingRepository";
import { v4 as uuidv4 } from "uuid";

export const initiateMatching = async (userId: string, myLanguage: string, learnLanguage: string) => {
  const { data: existingQueue } = await getExistingQueue(userId);

  if (!existingQueue || existingQueue.length === 0) {
    await addToQueue(userId, myLanguage, learnLanguage);
  }

  const { data: matchQueue } = await findMatch(userId, learnLanguage);

  if (matchQueue && matchQueue.length > 0) {
    const matchPartner = matchQueue[0];
    const roomId = uuidv4();
    await updateMatch(matchPartner.user_id as string, userId, roomId);
    return roomId;
  }

  return null;
};
