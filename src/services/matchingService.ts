// import {
//   addUserToMatchQueue,
//   getExistingQueue,
//   findUserFromMatchQueue,
//   updateUserFromMatchQueue,
//   getSharedConversationId
// } from "@/api/supabase/match";
// import { UserInfo } from "@/types/userType/userType";
// import { getRandomNumber } from "@/utils/randomNumber";
// import { v4 as uuidv4 } from "uuid";

// export const initiateMatching = async (userInfo: UserInfo) => {
//   // const { data: existingQueue } = await getExistingQueue(userInfo);

//   const { data: matchQueue } = await findUserFromMatchQueue(userInfo);

//   if (matchQueue && matchQueue.length > 0) {
//     const idx = getRandomNumber(matchQueue.length); // 랜덤 값 추출
//     const matchPartner = matchQueue[idx];

//     // 매칭 이력이 존재하는 사용자간의 대화방 id값 불러오기
//     // 존재하지 않으면 새로운 id값 생성
//     const roomId = (await getSharedConversationId(userInfo.id, matchPartner.user_id as string)) ?? uuidv4();

//     // 매치 큐에서 조건에 맞는 사용자 데이터 업데이트
//     // "UPDATE" 리스너를 통해 상대방도 라우트
//     await updateUserFromMatchQueue(matchPartner.user_id as string, userInfo.id, roomId);
//     return roomId;
//   } else {
//     await addUserToMatchQueue(userInfo);
//     return null;
//   }
// };
