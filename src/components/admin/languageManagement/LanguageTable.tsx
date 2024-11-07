import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { changeToUnuse, changeToUse, getLanguageList } from "@/api/route";

const LanguageTable = () => {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: ["languagesInfo"],
    queryFn: () => getLanguageList()
  });

  const handleLanguagetoUse = useMutation({
    mutationFn: (languageId: number) => changeToUse(languageId),
    onSuccess: () => {
      alert("해당 언어를 활성화하였습니다");
      queryClient.invalidateQueries({ queryKey: ["languagesInfo"] });
    }
  });

  const handleLanguagetoUnuse = useMutation({
    mutationFn: (languageId: number) => changeToUnuse(languageId),
    onSuccess: () => {
      alert("해당 언어를 비활성화하였습니다");
      queryClient.invalidateQueries({ queryKey: ["languagesInfo"] });
    }
  });

  if (isPending) {
    return <div>로딩중</div>;
  }

  if (isError) {
    return <div> 언어 목록을 가져오는데 실패했습니다 다시 시도해주세요</div>;
  }
  return (
    <div className="w-full text-center mt-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 font-semibold">
            <th className="p-3"></th>
            <th className="p-3">언어 이미지</th>
            <th className="p-3">언어</th>
            <th className="p-3">활성화 상태</th>
            <th className="p-3">언어 상태 관리</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="pt-3">
                등록된 회원이 없습니다
              </td>
            </tr>
          ) : (
            data.map((language, index) => (
              <tr key={language.id} className="border-b hover:bg-gray-900">
                <td>{index + 1}</td>
                <td className="p-3 flex items-center justify-center">
                  <Image
                    src={language.language_img_url}
                    alt="미리보기 이미지"
                    width={50}
                    height={50}
                    className="mb-4 rounded-md"
                  />
                </td>
                <td className="p-3">{language.language_name}</td>
                <td className="p-3">{language.status ? "사용언어" : "비사용언어"}</td>
                <td className="p-3">
                  {language.status ? (
                    <button
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => handleLanguagetoUnuse.mutate(language.id)}
                    >
                      비활성화
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-red-600"
                      onClick={() => handleLanguagetoUse.mutate(language.id)}
                    >
                      활성화
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LanguageTable;
