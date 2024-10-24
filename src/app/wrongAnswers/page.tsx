"use client";

interface WrongAnswer {
  id: number;
  wrong_answer: string;
  user_id: string;
}

import React, { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const WrongAnswersPage = () => {
  const session = useSession();
  const user = session?.user;
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  useEffect(() => {
    const fetchWrongAnswers = async () => {
      if (!user) return;

      const { data, error } = await supabase.from("wrong_answers").select("*").eq("user_id", user.id);

      if (error) {
        console.error("오답 조회 실패:", error);
      } else {
        setWrongAnswers(data);
      }
    };

    fetchWrongAnswers();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!user) return;

    const { error } = await supabase.from("wrong_answers").delete().match({ id, user_id: user.id });

    if (error) {
      console.error("오답 삭제 실패:", error);
    } else {
      setWrongAnswers(wrongAnswers.filter((answer) => answer.id !== id));
    }
  };

  return (
    <div>
      <h2>내 오답 노트</h2>
      <ul>
        {wrongAnswers.map((answer) => (
          <li key={answer.id}>
            {answer.wrong_answer}
            <button onClick={() => handleDelete(answer.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WrongAnswersPage;

// 유저 인증 전 데이터 뿌리기 테스트
// TODO: 인증

// "use client";

// interface WrongAnswer {
//   id: number;
//   wrong_answer: string;
//   user_id: string;
// }

// import React, { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";

// const supabase = createClient();

// const WrongAnswersPage = () => {
//   const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

//   useEffect(() => {
//     const fetchWrongAnswers = async () => {
//       const { data, error } = await supabase.from("wrong_answers").select("*");

//       if (error) {
//         console.error("오답 조회 실패:", error);
//       } else {
//         setWrongAnswers(data);
//       }
//     };

//     fetchWrongAnswers();
//   }, []);

//   return (
//     <div>
//       <h2>모든 오답 노트</h2>
//       <ul>
//         {wrongAnswers.map((answer) => (
//           <li key={answer.id}>{answer.wrong_answer}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default WrongAnswersPage;
